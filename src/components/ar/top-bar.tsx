"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle } from "lucide-react";

import { cn } from "lib/utils";

type StatusTone = "ready" | "loading" | "error";

type TopBarProps = {
  badgeLabel: string;
  status: StatusTone;
  onOpenChat: () => void;
  isChatOpen: boolean;
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
}: TopBarProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-3">
      <motion.div
        className="pointer-events-auto flex w-full max-w-2xl items-center justify-between gap-4 rounded-2xl border border-white/20 bg-white/15 px-5 py-3 text-sm text-white shadow-lg backdrop-blur-xl"
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
        <div className="flex flex-col">
          <span className="text-base font-semibold tracking-tight text-white">
            Global Insights
          </span>
          <span className="text-xs text-white/70">
            Reality layer for port performance
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
              toneClasses[status],
            )}
          >
            <span
              className={cn(
                "h-2.5 w-2.5 rounded-full",
                status === "ready"
                  ? "bg-emerald-300"
                  : status === "error"
                    ? "bg-rose-300"
                    : "bg-sky-300",
              )}
            />
            {badgeLabel}
          </span>

          <button
            type="button"
            onClick={onOpenChat}
            aria-pressed={isChatOpen}
            aria-label="Open AI Copilot"
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition",
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
