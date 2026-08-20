import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const EmailInput = z.object({
  context: z.string().min(1),
  tone: z.enum(["formal", "informal", "persuasive"]),
  audience: z.enum(["client", "manager", "team"]),
  recipient: z.string().optional(),
});

const NotesInput = z.object({
  notes: z.string().min(1),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    const { runGenerateEmail } = await import("./assistant.server");
    return runGenerateEmail(data);
  });

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => NotesInput.parse(input))
  .handler(async ({ data }) => {
    const { runSummarizeNotes } = await import("./assistant.server");
    return runSummarizeNotes(data);
  });
