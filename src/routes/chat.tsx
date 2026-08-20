import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Disclaimer,
  ErrorBox,
  PageHeader,
  Panel,
  inputClass,
} from "@/components/ui-kit";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Chat Assistant — Workplace Assistant" },
      {
        name: "description",
        content:
          "A general-purpose workplace chat assistant. Ask it to draft, plan, explain, or think something through with you.",
      },
      { property: "og:title", content: "Chat Assistant — Workplace Assistant" },
      {
        property: "og:description",
        content: "Ask a workplace question and get a quick, practical AI answer.",
      },
    ],
  }),
  component: ChatPage,
});

type Message = { role: "user" | "assistant"; content: string };

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = windowRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setError(null);
    setInput("");
    const history: Message[] = [...messages, { role: "user", content: text }];
    setMessages(history);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!response.ok || !response.body) {
        const detail = await response.text();
        throw new Error(detail || "The assistant could not respond.");
      }

      setMessages([...history, { role: "assistant", content: "" }]);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: assistantText }]);
      }
    } catch (err) {
      setMessages(history);
      setError(err instanceof Error ? err.message : "Something went wrong sending your message.");
    } finally {
      setLoading(false);
    }
  }

  const showTyping = loading && messages.at(-1)?.role === "user";

  return (
    <>
      <PageHeader eyebrow="Tool" title="Chat Assistant">
        A general-purpose workplace assistant. Ask it to draft, plan, explain, or think something
        through with you.
      </PageHeader>

      <Panel>
        <div
          ref={windowRef}
          className="mb-3.5 flex h-[400px] flex-col gap-3 overflow-y-auto rounded-sm border border-border bg-background p-4.5"
        >
          {messages.length === 0 && !loading ? (
            <div className="m-auto text-center text-[12.5px] text-faint">
              No messages yet — ask something below.
            </div>
          ) : (
            messages.map((message, i) =>
              message.role === "user" ? (
                <div
                  key={i}
                  className="max-w-[78%] self-end rounded-xl rounded-br-[2px] bg-accent px-3.5 py-2.5 text-[13.8px] leading-relaxed text-accent-foreground"
                >
                  {message.content}
                </div>
              ) : (
                <div
                  key={i}
                  className="max-w-[78%] space-y-2 self-start rounded-xl rounded-bl-[2px] border border-border bg-surface px-3.5 py-2.5 text-[13.8px] leading-relaxed [&_li]:ml-4 [&_li]:list-disc [&_ol_li]:list-decimal [&_strong]:font-semibold"
                >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              ),
            )
          )}
          {showTyping && (
            <div className="self-start font-mono text-[11px] tracking-[0.5px] text-faint">
              Assistant is typing…
            </div>
          )}
        </div>

        <div className="flex gap-2.5">
          <input
            type="text"
            className={`${inputClass} flex-1`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void send();
            }}
            placeholder="Ask the assistant something..."
          />
          <Button onClick={() => void send()} disabled={loading}>
            Send
          </Button>
        </div>

        <ErrorBox message={error} />
      </Panel>

      <Disclaimer>
        <b>Responsible AI notice:</b> responses are AI-generated and may be incomplete or
        inaccurate. Verify anything important before relying on it.
      </Disclaimer>
    </>
  );
}
