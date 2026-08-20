import { NoObjectGeneratedError, Output, streamText } from "ai";
import { z } from "zod";
import {
  CHAT_MODEL,
  createLovableAiGatewayProvider,
  describeGatewayError,
} from "./ai-gateway.server";

export type NotesSummary = {
  summary: string;
  key_points: string[];
  decisions: string[];
  action_items: { task: string; owner: string; deadline: string }[];
};

const notesSchema = z.object({
  summary: z.string(),
  key_points: z.array(z.string()),
  decisions: z.array(z.string()),
  action_items: z.array(
    z.object({
      task: z.string(),
      owner: z.string(),
      deadline: z.string(),
    }),
  ),
});

function gateway() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("The AI service is not configured (missing API key).");
  return createLovableAiGatewayProvider(key);
}

const EMAIL_SYSTEM =
  "You are a professional workplace email-writing assistant. Write clear, well-structured emails. Never invent specific facts, figures, or names beyond what the user provides. Output only the email itself (including a subject line), no preamble or commentary.";

export async function runGenerateEmail(data: {
  context: string;
  tone: string;
  audience: string;
  recipient?: string | undefined;
}) {
  const provider = gateway();
  const recipient = data.recipient?.trim();
  const userMsg = `Write a ${data.tone} email to a ${data.audience}${
    recipient ? " named " + recipient : ""
  }.\n\nContext / purpose of the email:\n${data.context}\n\nAdapt the vocabulary, formality, and structure appropriately for a ${data.audience} audience and a ${data.tone} tone.`;

  try {
    const result = streamText({
      model: provider(CHAT_MODEL),
      system: EMAIL_SYSTEM,
      messages: [{ role: "user", content: userMsg }],
    });
    return { email: await result.text };
  } catch (error) {
    throw new Error(describeGatewayError(error));
  }
}

const NOTES_SYSTEM = `You summarize workplace meeting notes into: a 2-3 sentence plain-language summary, key points, decisions, and action items with an owner and deadline.
If the notes don't clearly state an owner or deadline for an action item, use "Not specified" rather than guessing. If there are no decisions or action items, return an empty array for that field. Do not invent information that is not present in the notes.`;

export async function runSummarizeNotes(data: { notes: string }): Promise<NotesSummary> {
  const provider = gateway();

  try {
    const result = streamText({
      model: provider(CHAT_MODEL),
      system: NOTES_SYSTEM,
      output: Output.object({ schema: notesSchema }),
      messages: [{ role: "user", content: data.notes }],
    });
    const output = await result.output;
    return {
      summary: output.summary || "No summary available.",
      key_points: output.key_points ?? [],
      decisions: output.decisions ?? [],
      action_items: (output.action_items ?? []).map((item) => ({
        task: item.task,
        owner: item.owner || "Not specified",
        deadline: item.deadline || "Not specified",
      })),
    };
  } catch (error) {
    if (NoObjectGeneratedError.isInstance(error)) {
      throw new Error(
        "The summary came back in an unexpected format. Please try summarizing again.",
      );
    }
    throw new Error(describeGatewayError(error));
  }
}
