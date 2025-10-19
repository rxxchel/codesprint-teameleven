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
          className="fixed right-0 top-0 h-full w-[400px] bg-background border-l border-border shadow-2xl z-50 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
            <div>
              <h2 className="font-semibold text-lg">
                {terminal?.name || "PSA Network Insights"}
              </h2>
              {terminal && (
                <p className="text-xs text-muted-foreground">
                  {terminal.country} • {terminal.region}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Chat Messages */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-4"
            ref={containerRef}
            onScroll={handleScroll}
          >
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
          <div className="border-t border-border p-4 bg-muted/20">
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
