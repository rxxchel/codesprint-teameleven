"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "ui/button";
import { PreviewMessage, ErrorMessage } from "@/components/message";
import PromptInput from "@/components/prompt-input";
import { appStore } from "@/app/store";
import { useShallow } from "zustand/shallow";
import {
  DefaultChatTransport,
  isToolUIPart,
  lastAssistantMessageIsCompleteWithToolCalls,
  UIMessage,
} from "ai";
import { ChatApiSchemaRequestBody, ChatModel } from "app-types/chat";
import { useToRef } from "@/hooks/use-latest";
import { generateUUID } from "lib/utils";
import { Think } from "ui/think";
import type { PSATerminal } from "@/lib/psa-terminals-data";

type MapChatSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  terminal: PSATerminal | null;
};

// PSA Network Insights agent ID from database
const PSA_AGENT_ID = "fcb1433f-7b9a-43ec-9186-322b8161fdf1";
const PSA_AGENT_NAME = "PSA Network Insights Conversational AI Agent";

export function MapChatSidebar({
  isOpen,
  onClose,
  terminal,
}: MapChatSidebarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [input, setInput] = useState("");
  const [threadId] = useState(() => generateUUID());
  const [hasUserSentMessage, setHasUserSentMessage] = useState(false);

  const [
    model,
    toolChoice,
    allowedAppDefaultToolkit,
    allowedMcpServers,
    threadImageToolModel,
  ] = appStore(
    useShallow((state) => [
      state.chatModel,
      state.toolChoice,
      state.allowedAppDefaultToolkit,
      state.allowedMcpServers,
      state.threadImageToolModel,
    ]),
  );

  // Start with empty messages - context will be pre-filled in input
  const initialMessages = useMemo<Array<UIMessage>>(() => [], []);

  // PSA agent mention to force using only the PSA agent
  const psaAgentMention = useMemo(
    () => [
      {
        type: "agent" as const,
        agentId: PSA_AGENT_ID,
        name: PSA_AGENT_NAME,
        description: "AI assistant specialized in PSA Global Network Insights",
        icon: {
          type: "emoji" as const,
          value: "🚢",
        },
      },
    ],
    [],
  );

  const {
    messages,
    status,
    setMessages,
    addToolResult: _addToolResult,
    error,
    sendMessage,
    stop,
  } = useChat({
    id: threadId,
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    transport: new DefaultChatTransport({
      prepareSendMessagesRequest: ({ messages, body, id }) => {
        const lastMessage = messages.at(-1)!;

        const requestBody: ChatApiSchemaRequestBody = {
          ...body,
          id,
          chatModel:
            (body as { model: ChatModel })?.model ?? latestRef.current.model,
          toolChoice: latestRef.current.toolChoice,
          allowedAppDefaultToolkit: [], // Disable default tools when using agent
          allowedMcpServers: {}, // Disable MCP servers when using agent
          mentions: psaAgentMention, // Force PSA agent only
          message: lastMessage,
          imageTool: {
            model: latestRef.current.threadImageToolModel[threadId],
          },
        };
        return { body: requestBody };
      },
    }),
    messages: initialMessages,
    generateId: generateUUID,
    experimental_throttle: 100,
  });

  const addToolResult = useCallback(
    async (result: Parameters<typeof _addToolResult>[0]) => {
      await _addToolResult(result);
    },
    [_addToolResult],
  );

  // Wrap sendMessage to track when user sends their first message
  const handleSendMessage = useCallback(
    (message: Parameters<typeof sendMessage>[0]) => {
      setHasUserSentMessage(true);
      return sendMessage(message);
    },
    [sendMessage],
  );

  const latestRef = useToRef({
    toolChoice,
    model,
    allowedAppDefaultToolkit,
    allowedMcpServers,
    messages,
    threadImageToolModel,
  });

  const isLoading = useMemo(
    () => status === "streaming" || status === "submitted",
    [status],
  );

  const isPendingToolCall = useMemo(() => {
    if (status != "ready") return false;
    const lastMessage = messages.at(-1);
    if (lastMessage?.role != "assistant") return false;
    const lastPart = lastMessage.parts.at(-1);
    if (!lastPart) return false;
    if (!isToolUIPart(lastPart)) return false;
    if (lastPart.state.startsWith("output")) return false;
    return true;
  }, [status, messages]);

  const space = useMemo(() => {
    if (!isLoading || error) return false;
    const lastMessage = messages.at(-1);
    if (lastMessage?.role == "user") return "think";
    const lastPart = lastMessage?.parts.at(-1);
    if (!lastPart) return "think";
    const secondPart = lastMessage?.parts[1];
    if (secondPart?.type == "text" && secondPart.text.length == 0)
      return "think";
    if (lastPart?.type == "step-start") {
      return lastMessage?.parts.length == 1 ? "think" : "space";
    }
    return false;
  }, [isLoading, messages.at(-1)]);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isScrollAtBottom = scrollHeight - scrollTop - clientHeight < 50;

    setIsAtBottom(isScrollAtBottom);
  }, []);

  const scrollToBottom = useCallback(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  // Pre-fill input with terminal context when terminal is selected
  // Only pre-fill if user hasn't sent any messages yet
  useEffect(() => {
    if (!terminal) return;

    // If user has already sent messages, just open the sidebar (don't pre-fill)
    if (hasUserSentMessage || messages.length > 0) {
      return;
    }

    // Pre-fill the input with the terminal context
    const contextMessage = `[PSA Network Insights - Terminal Analysis Request]

You are analyzing the ${terminal.name} terminal in the PSA global network.

**Terminal Information:**
- Terminal ID: ${terminal.id}
- Name: ${terminal.name}
- Location: ${terminal.country}, ${terminal.region}

**Performance Metrics (Current Period):**
- Port Time Savings vs Baseline: ${terminal.port_time_savings_pct.toFixed(1)}%
- Total Bunker Fuel Saved: $${(terminal.bunker_saved_usd / 1000).toFixed(1)}K USD
- Carbon Emissions Abated: ${(terminal.carbon_abatement_tonnes / 1000).toFixed(1)}K tonnes CO₂
- Vessel Arrival Accuracy: ${terminal.arrival_accuracy_pct}%
- Total Port Calls: ${terminal.calls_made}
- Average Berth Time: ${terminal.avg_berth_time_hours.toFixed(1)} hours

Please provide a comprehensive analysis of this terminal's operational performance, highlighting:
1. Key strengths and what's working well
2. Areas that need improvement
3. Comparison to industry benchmarks (if applicable)
4. Actionable recommendations for optimization

Focus on being specific, data-driven, and providing practical insights that terminal managers can act on.`;

    setInput(contextMessage);
  }, [terminal, hasUserSentMessage, messages.length]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (isAtBottom && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, isAtBottom, scrollToBottom]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-full w-[420px] bg-white/95 backdrop-blur-2xl border-l border-white/50 shadow-2xl z-50 flex flex-col"
        >
          {/* Header with Gradient */}
          <div className="relative overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"></div>

            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                  backgroundSize: "32px 32px",
                }}
              ></div>
            </div>

            {/* Content */}
            <div className="relative flex items-center justify-between p-5 backdrop-blur-sm">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 shadow-lg border border-white/30">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="font-bold text-lg text-white truncate">
                    {terminal?.name || "PSA Network Insights"}
                  </h2>
                  {terminal && (
                    <p className="text-xs text-white/90 flex items-center gap-1.5">
                      <svg
                        className="w-3 h-3 flex-shrink-0"
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
                      </svg>
                      <span className="truncate">
                        {terminal.country} • {terminal.region}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-white/20 text-white flex-shrink-0 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-b from-transparent to-white/5"></div>
          </div>

          {/* Chat Messages */}
          <div
            className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-gray-50/50 to-white/50"
            ref={containerRef}
            onScroll={handleScroll}
          >
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-8 max-w-sm">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    AI-Powered Terminal Insights
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Review the pre-filled analysis request below and click send
                    to get comprehensive insights about this terminal.
                  </p>
                </div>
              </div>
            )}

            {messages.map((message, index) => {
              const isLastMessage = messages.length - 1 === index;
              return (
                <PreviewMessage
                  threadId={threadId}
                  messageIndex={index}
                  prevMessage={messages[index - 1]}
                  key={message.id}
                  message={message}
                  status={status}
                  addToolResult={addToolResult}
                  isLoading={isLoading || isPendingToolCall}
                  isLastMessage={isLastMessage}
                  setMessages={setMessages}
                  sendMessage={handleSendMessage}
                />
              );
            })}

            {space && (
              <div className={space == "space" ? "opacity-0" : ""}>
                <Think />
              </div>
            )}

            {error && <ErrorMessage error={error} />}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200/80 p-4 bg-white/80 backdrop-blur-sm">
            <PromptInput
              input={input}
              threadId={threadId}
              sendMessage={handleSendMessage}
              setInput={setInput}
              isLoading={isLoading || isPendingToolCall}
              onStop={stop}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
