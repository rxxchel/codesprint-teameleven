"use client";

import { motion, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/button";

import type { PortDatum } from "../ar-globe";

type PortInfoCardProps = {
  port: PortDatum;
  onClose: () => void;
  onAskAI: (prefill: string) => void;
};

export function PortInfoCard({ port, onClose, onAskAI }: PortInfoCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const { metrics } = port;

  const metricItems = [
    {
      label: "Arrival Accuracy Δ (week)",
      value: formatDelta(metrics.arrival_accuracy_delta_week),
    },
    {
      label: "Assured Port Time",
      value: `${metrics.assured_port_time_pct.toFixed(1)}%`,
    },
    {
      label: "Berth Time Variance",
      value: `${metrics.berth_time_variance_h.toFixed(1)} h`,
    },
    {
      label: "Throughput",
      value: `${Intl.NumberFormat("en-US").format(metrics.throughput_teu_day)} TEU/day`,
    },
  ];

  const kpiBadge = getTrend(metrics.arrival_accuracy_delta_week);
  const overallKpi = getTrend(port.kpi);

  const handleAsk = () => {
    const prompt = [
      `Explain this week's performance for ${port.name}.`,
      `arrival_accuracy_delta_week=${metrics.arrival_accuracy_delta_week.toFixed(2)},`,
      `assured_port_time_pct=${metrics.assured_port_time_pct.toFixed(1)}%,`,
      `berth_time_variance_h=${metrics.berth_time_variance_h.toFixed(1)}h,`,
      `throughput_teu_day=${metrics.throughput_teu_day} TEU/day.`,
      "Give 2 actions and 1 risk, concise.",
    ].join(" ");
    onAskAI(prompt);
  };

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0, bottom: 100 }}
      dragElastic={0.12}
      onDragEnd={(_, info) => {
        if (info.offset.y > 60) {
          onClose();
        }
      }}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
      animate={prefersReducedMotion ? false : { opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.35,
        ease: "easeOut",
      }}
      className="relative w-full max-w-xl rounded-2xl border border-white/20 bg-white/15 p-6 text-white shadow-lg backdrop-blur-xl pointer-events-auto"
    >
      <div className="absolute left-1/2 top-2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-white/40" />

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-white">
            Port of {port.name}
          </p>
          <p className="text-sm text-white/70">Live KPIs</p>
        </div>

        <div
          className={`inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium ${overallKpi.textClass}`}
        >
          <span
            className={`h-2.5 w-2.5 rounded-full ${overallKpi.dotClass}`}
            aria-hidden="true"
          />
          {overallKpi.prefix}
          {Math.abs(port.kpi).toFixed(2)}
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-4">
        {metricItems.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-3"
          >
            <dt className="text-xs uppercase tracking-wide text-white/60">
              {item.label}
            </dt>
            <dd className="mt-1 text-base font-semibold text-white">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 inline-flex items-center gap-2 text-sm text-white/70">
        <span className={`font-medium ${kpiBadge.textClass}`}>
          {kpiBadge.prefix}
          {Math.abs(metrics.arrival_accuracy_delta_week).toFixed(2)}
        </span>
        arrival accuracy change this week
      </div>

      <Button
        type="button"
        onClick={handleAsk}
        className="mt-6 w-full rounded-full border border-white/20 bg-white/20 py-5 text-base font-semibold text-white hover:bg-white/30"
        aria-label={`Ask AI about Port of ${port.name}`}
      >
        Ask AI about this terminal
      </Button>
    </motion.div>
  );
}

function getTrend(value: number) {
  if (value > 0.001) {
    return {
      prefix: "▲",
      textClass: "text-emerald-300",
      dotClass: "bg-emerald-300",
    };
  }
  if (value < -0.001) {
    return {
      prefix: "▼",
      textClass: "text-rose-300",
      dotClass: "bg-rose-300",
    };
  }
  return {
    prefix: "–",
    textClass: "text-zinc-200",
    dotClass: "bg-zinc-300",
  };
}

function formatDelta(value: number) {
  const trend = getTrend(value);
  const formatted = `${trend.prefix}${Math.abs(value).toFixed(2)}`;
  return formatted;
}

export default PortInfoCard;
