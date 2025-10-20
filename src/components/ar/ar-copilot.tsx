"use client";

import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
  TextUIPart,
  UIMessage,
} from "ai";
import clsx from "clsx";
import { ChatApiSchemaRequestBody, ChatModel } from "app-types/chat";
import { useEffect, useMemo, useRef, useState } from "react";
import { mutate } from "swr";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, StopCircle } from "lucide-react";
import { appStore } from "@/app/store";
import { useShallow } from "zustand/shallow";
import { useGenerateThreadTitle } from "@/hooks/queries/use-generate-thread-title";
import { useToRef } from "@/hooks/use-latest";
import { cn, generateUUID, truncateString } from "lib/utils";
import { toast } from "sonner";

type ArCopilotProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefill?: string | null;
  activePortName?: string | null;
};

export function ArCopilot({
  open,
  onOpenChange,
  prefill,
  activePortName,
}: ArCopilotProps) {
  const [threadId] = useState(() => generateUUID());
  const [input, setInput] = useState("");
  const [showErrorToast, setShowErrorToast] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const lastPrefillRef = useRef<string | null>(null);

  const [
    appStoreMutate,
    model,
    toolChoice,
    allowedAppDefaultToolkit,
    allowedMcpServers,
    threadList,
    threadMentions,
    pendingThreadMention,
    threadImageToolModel,
  ] = appStore(
    useShallow((state) => [
      state.mutate,
      state.chatModel,
      state.toolChoice,
      state.allowedAppDefaultToolkit,
      state.allowedMcpServers,
      state.threadList,
      state.threadMentions,
      state.pendingThreadMention,
      state.threadImageToolModel,
    ]),
  );

  const threadMentionsForThread = threadMentions[threadId] ?? [];

  const generateTitle = useGenerateThreadTitle({
    threadId,
  });

  const latestRef = useToRef({
    toolChoice,
    model,
    allowedAppDefaultToolkit,
    allowedMcpServers,
    messages: [] as UIMessage[],
    threadList,
    threadId,
    mentions: threadMentionsForThread,
    threadImageToolModel,
  });

  const onFinish = () => {
    const { messages } = latestRef.current;
    const prevThread = latestRef.current.threadList.find(
      (item) => item.id === threadId,
    );
    const isNewThread =
      !prevThread?.title &&
      messages.filter(
        (message) => message.role === "user" || message.role === "assistant",
      ).length < 3;

    if (isNewThread) {
      const snippet = messages
        .slice(0, 2)
        .flatMap((message) =>
          message.parts
            .filter((part) => part.type === "text")
            .map(
              (part) =>
                `${message.role}: ${truncateString(
                  (part as TextUIPart).text,
                  500,
                )}`,
            ),
        );

      if (snippet.length > 0) {
        generateTitle(snippet.join("\n\n"));
      }
    } else if (latestRef.current.threadList[0]?.id !== threadId) {
      mutate("/api/thread");
    }
  };

  const { messages, status, error, sendMessage, stop } = useChat({
    id: threadId,
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    transport: new DefaultChatTransport({
      prepareSendMessagesRequest: ({ messages, body, id }) => {
        latestRef.current.messages = messages;
        const lastMessage = messages.at(-1);
        if (!lastMessage) {
          return { body: body || {} };
        }

        const requestBody: ChatApiSchemaRequestBody = {
          ...body,
          id,
          chatModel:
            (body as { model?: ChatModel })?.model ?? latestRef.current.model,
          toolChoice: latestRef.current.toolChoice,
          allowedAppDefaultToolkit: latestRef.current.mentions?.length
            ? []
            : latestRef.current.allowedAppDefaultToolkit,
          allowedMcpServers: latestRef.current.mentions?.length
            ? {}
            : latestRef.current.allowedMcpServers,
          mentions: latestRef.current.mentions,
          message: lastMessage,
          imageTool: {
            model: latestRef.current.threadImageToolModel[threadId],
          },
        };

        return { body: requestBody };
      },
    }),
    messages: [],
    generateId: generateUUID,
    experimental_throttle: 100,
    onFinish,
  });

  latestRef.current = {
    toolChoice,
    model,
    allowedAppDefaultToolkit,
    allowedMcpServers,
    messages,
    threadList,
    threadId,
    mentions: threadMentionsForThread,
    threadImageToolModel,
  };

  useEffect(() => {
    if (!open) return;
    appStoreMutate({ currentThreadId: threadId });

    return () => {
      appStoreMutate((state) => {
        if (state.currentThreadId === threadId) {
          return { currentThreadId: null };
        }
        return {};
      });
    };
  }, [open, threadId, appStoreMutate]);

  useEffect(() => {
    if (!open) return;
    if (!pendingThreadMention) return;
    appStoreMutate((prev) => ({
      threadMentions: {
        ...prev.threadMentions,
        [threadId]: [pendingThreadMention],
      },
      pendingThreadMention: undefined,
    }));
  }, [open, pendingThreadMention, threadId, appStoreMutate]);

  useEffect(() => {
    if (!open) return;
    if (!prefill) return;
    if (lastPrefillRef.current === prefill) return;
    lastPrefillRef.current = prefill;
    setInput(prefill);
    textareaRef.current?.focus();
  }, [open, prefill]);

  useEffect(() => {
    if (!open) return;
    textareaRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!error || showErrorToast === error.message) return;
    toast.error(error.message);
    setShowErrorToast(error.message);
  }, [error, showErrorToast]);

  const isLoading = status === "streaming" || status === "submitted";

  const suggestionChips = useMemo(() => {
    const portName = activePortName ?? "this port";
    return [
      "Show ports with worsening arrival accuracy",
      `Why is ${portName} down this week?`,
      "What improves assured port time?",
    ];
  }, [activePortName]);

  const messageBubbles = useMemo(() => {
    const filtered = messages.filter(
      (message) => message.role === "user" || message.role === "assistant",
    );

    if (error) {
      return [
        ...filtered,
        {
          id: "ar-chat-error",
          role: "assistant" as const,
          parts: [
            {
              type: "text",
              text: error.message,
            } satisfies TextUIPart,
          ],
        },
      ];
    }

    return filtered;
  }, [messages, error]);

  const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const trimmed = input.trim();
    if (trimmed.length === 0) return;
    setInput("");
    sendMessage({
      role: "user",
      parts: [
        {
          type: "text",
          text: trimmed,
        },
      ],
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestion = (value: string) => {
    setInput(value);
    textareaRef.current?.focus();
  };

  if (!open) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex flex-col">
      <div className="pointer-events-auto px-4 pt-[calc(128px+env(safe-area-inset-top,0))]">
        <div className="mx-auto w-full max-w-xl">
          <div className="max-h-[32vh] space-y-3 overflow-y-auto pr-1">
            {messageBubbles.length === 0 ? (
              <div className="inline-flex rounded-2xl border border-white/20 bg-black/60 px-4 py-3 text-sm text-white/80 backdrop-blur">
                Start a conversation to get AI guidance for terminal ops.
              </div>
            ) : (
              messageBubbles.map((message) => {
                const text = message.parts
                  .filter((part) => part.type === "text")
                  .map((part) => (part as TextUIPart).text)
                  .join("\n")
                  .trim();
                const isUser = message.role === "user";
                return (
                  <div
                    key={message.id}
                    className={clsx(
                      "flex w-full",
                      isUser ? "justify-end" : "justify-start",
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-lg backdrop-blur",
                        isUser
                          ? "bg-white/80 text-black"
                          : "border border-white/20 bg-black/65 text-white",
                      )}
                    >
                      <p className="whitespace-pre-wrap">{text}</p>
                    </div>
                  </div>
                );
              })
            )}

            {isLoading && (
              <div className="flex w-full justify-start">
                <div className="flex items-center gap-2 rounded-3xl border border-white/20 bg-black/55 px-4 py-2 text-xs text-white/70">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Generating insight…
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1" />

      <form
        onSubmit={handleSubmit}
        className="pointer-events-auto px-4 pb-[calc(24px+env(safe-area-inset-bottom,0))]"
      >
        <div className="mx-auto flex w-full max-w-xl flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            {suggestionChips.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestion(suggestion)}
                className="rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/20"
              >
                {suggestion}
              </button>
            ))}
          </div>

          <div className="relative overflow-hidden rounded-[28px] border border-white/20 bg-black/65 p-3 shadow-2xl backdrop-blur">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about throughput impact, delays, or recommended actions…"
              className="min-h-[64px] resize-none border-none bg-transparent text-sm text-white placeholder:text-white/40 focus-visible:ring-0"
            />
            <div className="mt-2 flex items-center justify-between text-xs text-white/60">
              <span>
                {isLoading ? "Generating…" : "Shift+Enter for newline"}
              </span>
              <div className="flex items-center gap-2">
                {isLoading && (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20"
                    onClick={() => stop()}
                  >
                    <StopCircle className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={input.trim().length === 0 || isLoading}
                  size="icon"
                  className="h-10 w-10 rounded-full border border-white/30 bg-white text-black hover:bg-white/90 disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>

      <button
        type="button"
        onClick={() => onOpenChange(false)}
        className="pointer-events-auto absolute right-4 top-4 rounded-full border border-white/20 bg-black/60 px-3 py-1.5 text-xs text-white/70 backdrop-blur transition hover:bg-black/80"
      >
        Close chat
      </button>
    </div>
  );
}

export default ArCopilot;
