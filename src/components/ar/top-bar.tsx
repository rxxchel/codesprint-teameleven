"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle } from "lucide-react";

import {
  VisualizationMode,
  VISUALIZATION_MODE_OPTIONS,
} from "@/lib/ar-visualization";
import { cn } from "lib/utils";

type StatusTone = "ready" | "loading" | "error";

type TopBarProps = {
  badgeLabel: string;
  status: StatusTone;
  onOpenChat: () => void;
  isChatOpen: boolean;
  visualizationMode: VisualizationMode;
  onModeChange: (mode: VisualizationMode) => void;
};

const toneClasses: Record<StatusTone, string> = {
  ready: "bg-emerald-500/15 text-emerald-200",
  loading: "bg-sky-500/15 text-sky-100",
  error: "bg-rose-500/15 text-rose-100",
};

export function TopBar({
  badgeLabel,
  status,
  onOpenChat,
  isChatOpen,
  visualizationMode,
  onModeChange,
}: TopBarProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-3">
      <motion.div
        className="pointer-events-auto flex w-full max-w-3xl items-center justify-between gap-4 rounded-2xl border border-white/20 bg-white/15 px-5 py-3 text-sm text-white shadow-lg backdrop-blur-xl"
        initial={prefersReducedMotion ? false : { opacity: 0, y: -12 }}
        animate={
          prefersReducedMotion
            ? false
            : {
                opacity: 1,
                y: 0,
                transition: { duration: 0.4, ease: "easeOut" },
              }
        }
        style={{
          marginTop: "calc(env(safe-area-inset-top, 0px) + 12px)",
        }}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-base font-semibold tracking-tight text-white">
            Global Insights
          </span>
          <div className="flex flex-wrap items-center gap-2 text-xs text-white/70">
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full border border-white/15 px-2.5 py-0.5 font-medium",
                toneClasses[status],
              )}
            >
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  status === "ready"
                    ? "bg-emerald-300"
                    : status === "error"
                      ? "bg-rose-300"
                      : "bg-sky-300",
                )}
              />
              {badgeLabel}
            </span>
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-3">
          <label className="pointer-events-auto flex flex-col items-start text-left">
            <select
              value={visualizationMode}
              onChange={(event) =>
                onModeChange(event.target.value as VisualizationMode)
              }
              className="mt-1 h-9 min-w-[200px] rounded-full border border-white/30 bg-white/10 px-3 text-sm font-medium text-white shadow-xs transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              {VISUALIZATION_MODE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={onOpenChat}
            aria-pressed={isChatOpen}
            aria-label="Open AI Copilot"
            className={cn(
              "pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition",
              "bg-white/10 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
              isChatOpen && "bg-white/25",
            )}
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default TopBar;
