import { X } from "lucide-react";
import { useHint } from "@/hooks/use-hints";

interface HintTooltipProps {
  hintId: string;
  message: string;
  position?: "top" | "bottom";
}

export function HintTooltip({ hintId, message, position = "bottom" }: HintTooltipProps) {
  const { visible, dismiss } = useHint(hintId);

  if (!visible) return null;

  return (
    <div
      className={`absolute z-40 flex items-center gap-2 rounded border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs text-blue-400 shadow-lg ${
        position === "top" ? "bottom-full mb-2" : "top-full mt-2"
      }`}
    >
      <span>{message}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          dismiss();
        }}
        className="shrink-0 rounded p-0.5 hover:bg-blue-500/20"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
