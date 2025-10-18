"use client";

import { type MetricKey, METRICS } from "@/lib/psa-terminals-data";

type MapControlsProps = {
  selectedMetric: MetricKey;
  onMetricChange: (metric: MetricKey) => void;
};

export function MapControls({
  selectedMetric,
  onMetricChange,
}: MapControlsProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="font-semibold text-sm mb-3">Select Metric</h3>

      <div className="space-y-2">
        {METRICS.map((metric) => (
          <label
            key={metric.key}
            className="flex items-start cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
          >
            <input
              type="radio"
              name="metric"
              value={metric.key}
              checked={selectedMetric === metric.key}
              onChange={(e) => onMetricChange(e.target.value as MetricKey)}
              className="mt-0.5 mr-3"
            />
            <div className="flex-1">
              <div className="font-medium text-sm">{metric.label}</div>
              <div className="text-xs text-gray-600">{metric.description}</div>
            </div>
          </label>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Click on any terminal marker to view detailed metrics
        </p>
      </div>
    </div>
  );
}
