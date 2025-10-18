"use client";

import { useState } from "react";
import { PSANetworkMap } from "@/components/network-map/psa-network-map";
import { MapControls } from "@/components/network-map/map-controls";
import type { MetricKey, PSATerminal } from "@/lib/psa-terminals-data";

export default function NetworkMapPage() {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>(
    "port_time_savings_pct",
  );
  const [selectedTerminal, setSelectedTerminal] = useState<PSATerminal | null>(
    null,
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar - Controls */}
      <div className="w-80 p-4 overflow-y-auto bg-gray-50">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            PSA Network Insights
          </h1>
          <p className="text-sm text-gray-600">
            Global terminal performance visualization
          </p>
        </div>

        <MapControls
          selectedMetric={selectedMetric}
          onMetricChange={setSelectedMetric}
        />

        {selectedTerminal && (
          <div className="mt-4 bg-white rounded-lg shadow-lg p-4">
            <h3 className="font-semibold text-sm mb-2">Selected Terminal</h3>
            <p className="font-bold">{selectedTerminal.name}</p>
            <p className="text-xs text-gray-600">
              {selectedTerminal.country} • {selectedTerminal.region}
            </p>
          </div>
        )}

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">About This Map</h4>
          <p className="text-xs text-gray-700 leading-relaxed">
            This interactive map visualizes the performance of PSA&apos;s 9
            global terminals. Markers are color-coded and sized based on the
            selected metric. Click any marker to view detailed metrics for that
            terminal.
          </p>
        </div>
      </div>

      {/* Right - Map */}
      <div className="flex-1">
        <PSANetworkMap
          selectedMetric={selectedMetric}
          onTerminalClick={setSelectedTerminal}
        />
      </div>
    </div>
  );
}
