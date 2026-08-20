import { createFileRoute } from "@tanstack/react-router";
import { streamText } from "ai";
import {
  CHAT_MODEL,
  createLovableAiGatewayProvider,
  getLovableAiGatewayRunId,
} from "@/lib/ai-gateway.server";

const SYSTEM =
  "You are a practical general-purpose workplace assistant. Help the user draft, plan, explain, or think things through. Be concise and concrete. Never invent facts, names, or figures the user has not provided.";

type ChatMessage = { role: "user" | "assistant"; content: string };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { messages?: unknown };
        const messages = body.messages;
        if (!Array.isArray(messages) || messages.length === 0) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) {
          return new Response("The AI service is not configured (missing API key).", {
            status: 500,
          });
        }

        const gateway = createLovableAiGatewayProvider(key, getLovableAiGatewayRunId(request));

        try {
          const result = streamText({
            model: gateway(CHAT_MODEL),
            system: SYSTEM,
            messages: (messages as ChatMessage[]).map((m) => ({
              role: m.role,
              content: String(m.content),
            })),
          });

          return result.toTextStreamResponse();
        } catch (error) {
          const status =
            typeof error === "object" && error !== null && "statusCode" in error
              ? Number((error as { statusCode?: number }).statusCode) || 500
              : 500;
          const message =
            error instanceof Error ? error.message : "The AI service returned an error.";
          return new Response(message, { status });
        }
      },
    },
  },
});
