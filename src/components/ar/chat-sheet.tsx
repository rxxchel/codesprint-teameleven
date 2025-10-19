"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type ChatSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefill?: string | null;
  activePortName?: string | null;
};

export function ChatSheet({
  open,
  onOpenChange,
  prefill,
  activePortName,
}: ChatSheetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const latestPrefillRef = useRef<string | null>(null);
  const streamTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      return undefined;
    }
    // reset composer when closing
    if (streamTimeoutRef.current) {
      clearTimeout(streamTimeoutRef.current);
      streamTimeoutRef.current = null;
    }
    setIsStreaming(false);
    return undefined;
  }, [open]);

  useEffect(() => {
    if (!open || !prefill) return;
    if (latestPrefillRef.current === prefill) return;
    latestPrefillRef.current = prefill;
    setInput(prefill);
  }, [open, prefill]);

  useEffect(() => {
    if (!open) return;
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(
    () => () => {
      if (streamTimeoutRef.current) {
        clearTimeout(streamTimeoutRef.current);
      }
    },
    [],
  );

  const suggestionChips = useMemo(() => {
    const portName = activePortName ?? "this port";
    return [
      "Show ports with worsening arrival accuracy",
      `Why is ${portName} down this week?`,
      "What improves assured port time?",
    ];
  }, [activePortName]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const question = input.trim();
    if (!question) return;

    const id = crypto.randomUUID();
    setMessages((prev) => [...prev, { id, role: "user", content: question }]);
    setInput("");
    runMockAssistant(question);
  };

  const runMockAssistant = (question: string) => {
    const replyId = crypto.randomUUID();
    const reply = buildMockReply(question, activePortName);
    setMessages((prev) => [
      ...prev,
      { id: replyId, role: "assistant", content: "" },
    ]);
    setIsStreaming(true);

    const stream = (index: number) => {
      setMessages((prev) =>
        prev.map((message) =>
          message.id === replyId
            ? { ...message, content: reply.slice(0, index) }
            : message,
        ),
      );
      if (index < reply.length) {
        streamTimeoutRef.current = setTimeout(() => stream(index + 1), 18);
      } else {
        setIsStreaming(false);
        streamTimeoutRef.current = null;
      }
    };

    stream(1);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="z-50 mx-auto flex h-[90vh] w-full max-w-2xl flex-col rounded-t-3xl border border-white/20 bg-white/15 p-0 text-white backdrop-blur-xl"
      >
        <SheetHeader className="border-b border-white/10 px-6 pb-4 pt-6 text-left">
          <SheetTitle className="text-lg font-semibold text-white">
            AI Copilot
          </SheetTitle>
          <SheetDescription className="text-sm text-white/70">
            Ask about port performance and get tactical guidance.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-4 pb-4">
            {messages.length === 0 && (
              <div className="rounded-xl border border-white/15 bg-white/10 p-4 text-sm text-white/70">
                Start a conversation or pick a suggestion to explore port
                performance trends.
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.role === "user"
                    ? "ml-auto w-fit max-w-[85%] rounded-2xl bg-white/25 px-4 py-3 text-sm font-medium text-white shadow-lg backdrop-blur"
                    : "mr-auto w-fit max-w-[85%] rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/85 shadow-lg backdrop-blur"
                }
              >
                <p className="whitespace-pre-wrap leading-relaxed">
                  {message.content || (isStreaming ? "…" : "")}
                </p>
              </div>
            ))}
            <div ref={scrollAnchorRef} />
          </div>
        </ScrollArea>

        <div className="border-t border-white/10 px-6 py-4">
          <div className="flex flex-wrap gap-2 pb-3">
            {suggestionChips.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setInput(suggestion)}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/20"
              >
                {suggestion}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about throughput impact, delays, or recommended actions…"
              className="min-h-[110px] resize-none rounded-2xl border-white/20 bg-black/40 text-sm text-white placeholder:text-white/40 focus-visible:ring-white/60"
            />
            <div className="flex items-center justify-between text-xs text-white/60">
              <span>
                {isStreaming
                  ? "Generating insights…"
                  : "Shift+Enter for newline"}
              </span>
              <Button
                type="submit"
                disabled={!input.trim() || isStreaming}
                className="rounded-full border border-white/20 bg-white/20 px-6 text-sm font-semibold text-white hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Send
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function buildMockReply(question: string, portName?: string | null) {
  const name = portName ?? "the terminal";
  return [
    `Here is a quick take on ${name}:`,
    "",
    "• Prioritise tighter berth scheduling and cross-team check-ins within the next 24 hours.",
    "• Coordinate with landside partners to accelerate box clearance and keep throughput stable.",
    "Risk: Weather or congestion could erode arrival accuracy again if buffers are removed too quickly.",
    "",
    `You asked: ${question}`,
  ].join("\n");
}

export default ChatSheet;
