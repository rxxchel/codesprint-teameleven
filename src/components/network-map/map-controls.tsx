"use client";

import { type MetricKey, METRICS } from "@/lib/psa-terminals-data";
import {
  TrendingUp,
  DollarSign,
  Leaf,
  Target,
  Ship,
  Clock,
} from "lucide-react";

type MapControlsProps = {
  selectedMetric: MetricKey;
  onMetricChange: (metric: MetricKey) => void;
};

// Icon mapping for each metric
const METRIC_ICONS: Record<
  MetricKey,
  React.ComponentType<{ className?: string }>
> = {
  port_time_savings_pct: TrendingUp,
  bunker_saved_usd: DollarSign,
  carbon_abatement_tonnes: Leaf,
  arrival_accuracy_pct: Target,
  calls_made: Ship,
  avg_berth_time_hours: Clock,
};

// Color schemes for each metric
const METRIC_COLORS: Record<
  MetricKey,
  { gradient: string; bg: string; border: string; text: string }
> = {
  port_time_savings_pct: {
    gradient: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
  },
  bunker_saved_usd: {
    gradient: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
  },
  carbon_abatement_tonnes: {
    gradient: "from-green-500 to-lime-500",
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
  },
  arrival_accuracy_pct: {
    gradient: "from-purple-500 to-pink-500",
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
  },
  calls_made: {
    gradient: "from-orange-500 to-amber-500",
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
  },
  avg_berth_time_hours: {
    gradient: "from-indigo-500 to-blue-500",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    text: "text-indigo-700",
  },
};

export function MapControls({
  selectedMetric,
  onMetricChange,
}: MapControlsProps) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
        <h3 className="font-bold text-base text-gray-900">Select Metric</h3>
      </div>

      <div className="space-y-2.5">
        {METRICS.map((metric) => {
          const Icon = METRIC_ICONS[metric.key];
          const colors = METRIC_COLORS[metric.key];
          const isSelected = selectedMetric === metric.key;

          return (
            <label
              key={metric.key}
              className={`
                group relative flex items-start cursor-pointer p-3.5 rounded-xl transition-all duration-300
                ${
                  isSelected
                    ? `${colors.bg} border-2 ${colors.border} shadow-lg shadow-${colors.border.split("-")[1]}-200/50 scale-[1.02]`
                    : "border-2 border-transparent hover:border-gray-200 hover:bg-gray-50/80 hover:shadow-md"
                }
              `}
            >
              <input
                type="radio"
                name="metric"
                value={metric.key}
                checked={isSelected}
                onChange={(e) => onMetricChange(e.target.value as MetricKey)}
                className="sr-only"
              />

              {/* Icon with gradient background */}
              <div
                className={`
                flex items-center justify-center w-10 h-10 rounded-lg mr-3 transition-all duration-300
                ${
                  isSelected
                    ? `bg-gradient-to-br ${colors.gradient} shadow-lg`
                    : "bg-gray-100 group-hover:bg-gray-200"
                }
              `}
              >
                <Icon
                  className={`w-5 h-5 ${isSelected ? "text-white" : "text-gray-600 group-hover:text-gray-800"}`}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div
                  className={`font-semibold text-sm mb-0.5 transition-colors ${isSelected ? colors.text : "text-gray-900"}`}
                >
                  {metric.label}
                </div>
                <div
                  className={`text-xs leading-relaxed transition-colors ${isSelected ? "text-gray-700" : "text-gray-600"}`}
                >
                  {metric.description}
                </div>
              </div>

              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div
                    className={`w-2 h-2 rounded-full bg-gradient-to-br ${colors.gradient} animate-pulse`}
                  ></div>
                </div>
              )}
            </label>
          );
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-gray-200/80">
        <div className="flex items-start gap-2">
          <svg
            className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-xs text-gray-600 leading-relaxed">
            Click on any terminal marker to view detailed metrics and AI-powered
            insights
          </p>
        </div>
      </div>
    </div>
  );
}
