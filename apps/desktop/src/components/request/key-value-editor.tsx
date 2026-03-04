import type { KeyValuePair } from "@apiark/types";
import { Plus, Trash2 } from "lucide-react";

interface KeyValueEditorProps {
  pairs: KeyValuePair[];
  onChange: (pairs: KeyValuePair[]) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
}

export function KeyValueEditor({
  pairs,
  onChange,
  keyPlaceholder = "Key",
  valuePlaceholder = "Value",
}: KeyValueEditorProps) {
  const update = (index: number, field: keyof KeyValuePair, value: string | boolean) => {
    const updated = pairs.map((p, i) =>
      i === index ? { ...p, [field]: value } : p,
    );
    onChange(updated);
  };

  const addRow = () => {
    onChange([...pairs, { key: "", value: "", enabled: true }]);
  };

  const removeRow = (index: number) => {
    if (pairs.length <= 1) {
      onChange([{ key: "", value: "", enabled: true }]);
      return;
    }
    onChange(pairs.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-1">
      {/* Header row */}
      <div className="grid grid-cols-[auto_1fr_1fr_auto] items-center gap-2 px-1 text-xs text-[#71717a]">
        <span className="w-5" />
        <span>{keyPlaceholder}</span>
        <span>{valuePlaceholder}</span>
        <span className="w-7" />
      </div>

      {/* Rows */}
      {pairs.map((pair, index) => (
        <div
          key={index}
          className="grid grid-cols-[auto_1fr_1fr_auto] items-center gap-2 px-1"
        >
          <input
            type="checkbox"
            checked={pair.enabled}
            onChange={(e) => update(index, "enabled", e.target.checked)}
            className="h-4 w-4 accent-blue-500"
          />
          <input
            type="text"
            value={pair.key}
            onChange={(e) => update(index, "key", e.target.value)}
            placeholder={keyPlaceholder}
            className="rounded bg-[#1c1c1f] px-2 py-1 text-sm text-[#e4e4e7] placeholder-[#52525b] outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="text"
            value={pair.value}
            onChange={(e) => update(index, "value", e.target.value)}
            placeholder={valuePlaceholder}
            className="rounded bg-[#1c1c1f] px-2 py-1 text-sm text-[#e4e4e7] placeholder-[#52525b] outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={() => removeRow(index)}
            className="rounded p-1 text-[#71717a] hover:bg-[#2a2a2e] hover:text-red-400"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}

      {/* Add row button */}
      <button
        onClick={addRow}
        className="flex items-center gap-1 px-1 pt-1 text-xs text-[#71717a] hover:text-[#e4e4e7]"
      >
        <Plus className="h-3 w-3" /> Add
      </button>
    </div>
  );
}
