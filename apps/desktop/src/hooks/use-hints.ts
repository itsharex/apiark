import { useState, useCallback } from "react";

const HINTS_STORAGE_KEY = "apiark:dismissed-hints";

function getDismissedHints(): Set<string> {
  try {
    const raw = localStorage.getItem(HINTS_STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveDismissedHints(hints: Set<string>) {
  localStorage.setItem(HINTS_STORAGE_KEY, JSON.stringify([...hints]));
}

/**
 * Hook for contextual hints that are shown once and dismissed forever.
 * @param hintId Unique identifier for this hint
 * @returns { visible, dismiss } — whether to show the hint and a function to dismiss it
 */
export function useHint(hintId: string) {
  const [visible, setVisible] = useState(() => !getDismissedHints().has(hintId));

  const dismiss = useCallback(() => {
    setVisible(false);
    const dismissed = getDismissedHints();
    dismissed.add(hintId);
    saveDismissedHints(dismissed);
  }, [hintId]);

  return { visible, dismiss };
}
