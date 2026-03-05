import { create } from "zustand";

// --- Types ---

export interface ShortcutBinding {
  key: string; // lowercase key name (e.g. "n", "enter", "`", "\\")
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

export interface ShortcutAction {
  id: string;
  description: string;
  defaultBinding: ShortcutBinding | null;
}

// --- Constants ---

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

function binding(key: string, opts?: { shift?: boolean; alt?: boolean }): ShortcutBinding {
  return { key, ctrl: true, shift: opts?.shift ?? false, alt: opts?.alt ?? false };
}

export const SHORTCUT_ACTIONS: ShortcutAction[] = [
  { id: "newTab", description: "New tab", defaultBinding: binding("n") },
  { id: "newWindow", description: "New window", defaultBinding: binding("n", { shift: true }) },
  { id: "closeTab", description: "Close tab", defaultBinding: binding("w") },
  { id: "save", description: "Save request", defaultBinding: binding("s") },
  { id: "send", description: "Send request", defaultBinding: binding("enter") },
  { id: "settings", description: "Settings", defaultBinding: binding(",") },
  { id: "curlImport", description: "Import cURL", defaultBinding: binding("i") },
  { id: "commandPalette", description: "Command palette", defaultBinding: binding("k") },
  { id: "focusUrl", description: "Focus URL bar", defaultBinding: binding("l") },
  { id: "focusEnv", description: "Focus environment selector", defaultBinding: binding("e") },
  { id: "toggleSidebar", description: "Toggle sidebar", defaultBinding: binding("\\") },
  { id: "toggleZen", description: "Toggle Zen mode", defaultBinding: binding(".") },
  { id: "toggleTerminal", description: "Toggle terminal", defaultBinding: binding("`") },
  { id: "undo", description: "Undo", defaultBinding: binding("z") },
  { id: "redo", description: "Redo", defaultBinding: binding("z", { shift: true }) },
  { id: "aiAssistant", description: "AI assistant", defaultBinding: binding("a", { shift: true }) },
  { id: "toggleConsole", description: "Toggle console", defaultBinding: null },
];

const STORAGE_KEY = "apiark-shortcuts";

// --- Helpers ---

function bindingEquals(a: ShortcutBinding | null, b: ShortcutBinding | null): boolean {
  if (a === null && b === null) return true;
  if (a === null || b === null) return false;
  return a.key === b.key && a.ctrl === b.ctrl && a.shift === b.shift && a.alt === b.alt;
}

function bindingFromEvent(e: KeyboardEvent): ShortcutBinding {
  return {
    key: e.key.toLowerCase(),
    ctrl: isMac ? e.metaKey : e.ctrlKey,
    shift: e.shiftKey,
    alt: e.altKey,
  };
}

function bindingMatchesEvent(b: ShortcutBinding, e: KeyboardEvent): boolean {
  const mod = isMac ? e.metaKey : e.ctrlKey;
  return (
    b.key === e.key.toLowerCase() &&
    b.ctrl === mod &&
    b.shift === e.shiftKey &&
    b.alt === e.altKey
  );
}

export function formatBinding(b: ShortcutBinding | null): string {
  if (!b) return "Unbound";
  const parts: string[] = [];
  if (b.ctrl) parts.push(isMac ? "\u2318" : "Ctrl");
  if (b.shift) parts.push(isMac ? "\u21E7" : "Shift");
  if (b.alt) parts.push(isMac ? "\u2325" : "Alt");

  // Pretty-print the key name
  const keyName = KEY_DISPLAY_NAMES[b.key] ?? b.key.toUpperCase();
  parts.push(keyName);
  return parts.join(isMac ? "" : "+");
}

/** Split a formatted binding string into individual key segments for rendering as <kbd> elements */
export function formatBindingParts(b: ShortcutBinding | null): string[] {
  if (!b) return ["Unbound"];
  const parts: string[] = [];
  if (b.ctrl) parts.push(isMac ? "\u2318" : "Ctrl");
  if (b.shift) parts.push(isMac ? "\u21E7" : "Shift");
  if (b.alt) parts.push(isMac ? "\u2325" : "Alt");
  const keyName = KEY_DISPLAY_NAMES[b.key] ?? b.key.toUpperCase();
  parts.push(keyName);
  return parts;
}

const KEY_DISPLAY_NAMES: Record<string, string> = {
  enter: "Enter",
  escape: "Esc",
  backspace: "Backspace",
  delete: "Del",
  tab: "Tab",
  " ": "Space",
  arrowup: "\u2191",
  arrowdown: "\u2193",
  arrowleft: "\u2190",
  arrowright: "\u2192",
  "\\": "\\",
  "`": "`",
  ",": ",",
  ".": ".",
  "/": "/",
  ";": ";",
  "'": "'",
  "[": "[",
  "]": "]",
  "-": "-",
  "=": "=",
};

// --- Persistence ---

type OverrideMap = Record<string, ShortcutBinding | null>;

function loadOverrides(): OverrideMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as OverrideMap;
  } catch {
    return {};
  }
}

function saveOverrides(overrides: OverrideMap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    // ignore storage errors
  }
}

// --- Store ---

interface ShortcutsState {
  /** Custom overrides (action id -> binding or null for unbound). Only contains non-default entries. */
  overrides: OverrideMap;

  /** Get the effective binding for an action */
  getBinding: (actionId: string) => ShortcutBinding | null;

  /** Match a keyboard event to an action id, or null if no match */
  matchShortcut: (e: KeyboardEvent) => string | null;

  /** Set a custom binding for an action */
  setBinding: (actionId: string, binding: ShortcutBinding | null) => void;

  /** Reset a single action to its default */
  resetBinding: (actionId: string) => void;

  /** Reset all bindings to defaults */
  resetAll: () => void;

  /** Find conflicts: actions that share the same binding */
  findConflicts: () => Array<{ actionIds: string[]; binding: ShortcutBinding }>;
}

export const useShortcutsStore = create<ShortcutsState>((set, get) => ({
  overrides: loadOverrides(),

  getBinding: (actionId: string) => {
    const { overrides } = get();
    if (actionId in overrides) return overrides[actionId] ?? null;
    const action = SHORTCUT_ACTIONS.find((a) => a.id === actionId);
    return action?.defaultBinding ?? null;
  },

  matchShortcut: (e: KeyboardEvent) => {
    const state = get();
    for (const action of SHORTCUT_ACTIONS) {
      const binding = state.getBinding(action.id);
      if (binding && bindingMatchesEvent(binding, e)) {
        return action.id;
      }
    }
    return null;
  },

  setBinding: (actionId: string, newBinding: ShortcutBinding | null) => {
    const action = SHORTCUT_ACTIONS.find((a) => a.id === actionId);
    if (!action) return;

    // If the new binding matches the default, remove the override
    const isDefault = bindingEquals(newBinding, action.defaultBinding);

    set((state) => {
      const next = { ...state.overrides };
      if (isDefault) {
        delete next[actionId];
      } else {
        next[actionId] = newBinding;
      }
      saveOverrides(next);
      return { overrides: next };
    });
  },

  resetBinding: (actionId: string) => {
    set((state) => {
      const next = { ...state.overrides };
      delete next[actionId];
      saveOverrides(next);
      return { overrides: next };
    });
  },

  resetAll: () => {
    saveOverrides({});
    set({ overrides: {} });
  },

  findConflicts: () => {
    const state = get();
    const bindingMap = new Map<string, string[]>();

    for (const action of SHORTCUT_ACTIONS) {
      const b = state.getBinding(action.id);
      if (!b) continue;
      const key = `${b.ctrl ? "c" : ""}${b.shift ? "s" : ""}${b.alt ? "a" : ""}:${b.key}`;
      const existing = bindingMap.get(key) ?? [];
      existing.push(action.id);
      bindingMap.set(key, existing);
    }

    const conflicts: Array<{ actionIds: string[]; binding: ShortcutBinding }> = [];
    for (const [, actionIds] of bindingMap) {
      if (actionIds.length > 1) {
        const b = state.getBinding(actionIds[0]);
        if (b) conflicts.push({ actionIds, binding: b });
      }
    }
    return conflicts;
  },
}));

/** Helper to create a ShortcutBinding from a KeyboardEvent (useful for rebinding UI) */
export function bindingFromKeyboardEvent(e: KeyboardEvent): ShortcutBinding | null {
  // Ignore modifier-only keypresses
  if (["Control", "Shift", "Alt", "Meta"].includes(e.key)) return null;
  return bindingFromEvent(e);
}
