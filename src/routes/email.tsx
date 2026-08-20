import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  Button,
  Disclaimer,
  ErrorBox,
  Field,
  OutputLabel,
  PageHeader,
  Panel,
  Spinner,
  inputClass,
} from "@/components/ui-kit";
import { generateEmail } from "@/lib/assistant.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workplace Assistant" },
      {
        name: "description",
        content:
          "Describe what your email needs to say, pick a tone and audience, and get a ready-to-edit professional draft.",
      },
      { property: "og:title", content: "Smart Email Generator — Workplace Assistant" },
      {
        property: "og:description",
        content: "AI-drafted workplace emails with the right tone for the right audience.",
      },
    ],
  }),
  component: EmailPage,
});

type Tone = "formal" | "informal" | "persuasive";
type Audience = "client" | "manager" | "team";

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [context, setContext] = useState("");
  const [tone, setTone] = useState<Tone>("formal");
  const [audience, setAudience] = useState<Audience>("client");
  const [recipient, setRecipient] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function onGenerate() {
    setError(null);
    if (!context.trim()) {
      setError("Please describe what the email is about.");
      return;
    }
    setLoading(true);
    try {
      const data = await run({
        data: { context: context.trim(), tone, audience, recipient: recipient.trim() },
      });
      setResult(data.email);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong generating the email.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function onCopy() {
    if (result === null) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <>
      <PageHeader eyebrow="Tool" title="Smart Email Generator">
        Describe what the email needs to say. Choose a tone and an audience, and a ready-to-edit
        draft is generated for you.
      </PageHeader>

      <Panel>
        <Field label="What is this email about?">
          <textarea
            rows={4}
            className={inputClass}
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g. Letting a client know their project delivery will be delayed by one week due to a supplier issue."
          />
        </Field>

        <div className="flex flex-wrap gap-4">
          <Field label="Tone" className="min-w-[170px] flex-1">
            <select
              className={inputClass}
              value={tone}
              onChange={(e) => setTone(e.target.value as Tone)}
            >
              <option value="formal">Formal</option>
              <option value="informal">Informal</option>
              <option value="persuasive">Persuasive</option>
            </select>
          </Field>
          <Field label="Audience" className="min-w-[170px] flex-1">
            <select
              className={inputClass}
              value={audience}
              onChange={(e) => setAudience(e.target.value as Audience)}
            >
              <option value="client">Client</option>
              <option value="manager">Manager</option>
              <option value="team">Team</option>
            </select>
          </Field>
          <Field label="Recipient name (optional)" className="min-w-[170px] flex-1">
            <input
              type="text"
              className={inputClass}
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. Thandeka"
            />
          </Field>
        </div>

        <Button onClick={onGenerate} disabled={loading}>
          {loading ? (
            <>
              <Spinner /> Generating...
            </>
          ) : (
            "Generate email"
          )}
        </Button>

        <ErrorBox message={error} />

        {result !== null && (
          <div className="mt-[22px] border-t border-border pt-5">
            <OutputLabel
              action={
                <button
                  onClick={onCopy}
                  className="rounded-[6px] bg-accent-soft px-2.5 py-[5px] font-sans text-[11.5px] font-semibold normal-case tracking-normal text-accent"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              }
            >
              Generated draft{" "}
              <span className="font-sans text-[11.5px] normal-case tracking-normal">
                — click into it to edit
              </span>
            </OutputLabel>
            <textarea
              className={`${inputClass} min-h-[220px] px-4.5 py-4 leading-relaxed`}
              value={result}
              onChange={(e) => setResult(e.target.value)}
            />
          </div>
        )}
      </Panel>

      <Disclaimer>
        <b>Responsible AI notice:</b> this draft is AI-generated and may contain errors or miss
        context only you would know. Review and edit it before sending.
      </Disclaimer>
    </>
  );
}
