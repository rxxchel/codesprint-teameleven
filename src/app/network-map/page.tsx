"use client";

import { useState } from "react";
import { PSANetworkMap } from "@/components/network-map/psa-network-map";
import { MapControls } from "@/components/network-map/map-controls";
import { MapChatSidebar } from "@/components/network-map/map-chat-sidebar";
import { Button } from "ui/button";
import { Menu, X } from "lucide-react";
import type { MetricKey, PSATerminal } from "@/lib/psa-terminals-data";

export default function NetworkMapPage() {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>(
    "port_time_savings_pct",
  );
  const [selectedTerminal, setSelectedTerminal] = useState<PSATerminal | null>(
    null,
  );
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatTerminal, setChatTerminal] = useState<PSATerminal | null>(null);

  const handleAskAI = (terminal: PSATerminal) => {
    setChatTerminal(terminal);
    setIsChatOpen(true);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-900 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/4 w-1/2 h-full bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -right-1/4 w-1/2 h-full bg-gradient-to-tl from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Left Sidebar Toggle Button (when collapsed) */}
      {!isLeftSidebarOpen && (
        <div className="absolute top-6 left-6 z-40">
          <Button
            variant="default"
            size="icon"
            onClick={() => setIsLeftSidebarOpen(true)}
            className="shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 border-0"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Left Sidebar - Controls */}
      {isLeftSidebarOpen && (
        <div className="w-80 p-5 overflow-y-auto bg-gray-900/90 backdrop-blur-xl border-r border-gray-700/50 relative z-30 transition-all duration-300">
          <div className="absolute top-5 right-5 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsLeftSidebarOpen(false)}
              className="hover:bg-gray-800/80 backdrop-blur-sm transition-all duration-300 rounded-xl text-gray-300 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="mb-7 pr-12">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  PSA Network Insights
                </h1>
                <p className="text-sm text-gray-400 font-medium">
                  Global terminal performance
                </p>
              </div>
            </div>
          </div>

          <MapControls
            selectedMetric={selectedMetric}
            onMetricChange={setSelectedMetric}
          />

          {selectedTerminal && (
            <div className="mt-5 bg-gradient-to-br from-gray-800/90 to-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-5 transition-all duration-300 animate-in slide-in-from-top">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                <h3 className="font-bold text-sm text-white">
                  Selected Terminal
                </h3>
              </div>
              <p className="font-bold text-lg text-white mb-1">
                {selectedTerminal.name}
              </p>
              <p className="text-sm text-gray-400 flex items-center gap-1.5">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {selectedTerminal.country} • {selectedTerminal.region}
              </p>
            </div>
          )}

          <div className="mt-5 p-5 bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-sm rounded-2xl border border-blue-500/30 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                <svg
                  className="w-5 h-5 text-white"
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
              </div>
              <div>
                <h4 className="font-bold text-sm mb-2 text-white">
                  About This Map
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  This interactive map visualizes the performance of PSA&apos;s
                  9 global terminals. Markers are color-coded and sized based on
                  the selected metric. Click any marker to view detailed metrics
                  for that terminal.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Right - Map */}
      <div className="flex-1">
        <PSANetworkMap
          selectedMetric={selectedMetric}
          onTerminalClick={setSelectedTerminal}
          onAskAI={handleAskAI}
        />
      </div>

      {/* Chat Sidebar */}
      <MapChatSidebar
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        terminal={chatTerminal}
      />
    </div>
  );
}
