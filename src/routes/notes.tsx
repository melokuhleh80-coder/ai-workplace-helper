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
import { summarizeNotes } from "@/lib/assistant.functions";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workplace Assistant" },
      {
        name: "description",
        content:
          "Paste messy meeting notes and get a summary, key points, decisions, and action items with owners and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Workplace Assistant" },
      {
        property: "og:description",
        content: "Condense raw meeting notes into decisions and action items in seconds.",
      },
    ],
  }),
  component: NotesPage,
});

type Summary = {
  summary: string;
  key_points: string[];
  decisions: string[];
  action_items: { task: string; owner: string; deadline: string }[];
};

function NotesBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-sm border border-border bg-background px-4.5 py-4">
      <h3 className="mb-2.5 font-mono text-[10.5px] font-semibold tracking-[0.9px] text-accent uppercase">
        {title}
      </h3>
      {children}
    </div>
  );
}

const editable = "rounded-[4px] outline-none focus:bg-accent-soft focus:ring-2 focus:ring-accent-soft";

function NotesPage() {
  const run = useServerFn(summarizeNotes);
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSummarize() {
    setError(null);
    if (!notes.trim()) {
      setError("Please paste in some meeting notes first.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      setResult(await run({ data: { notes: notes.trim() } }));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong summarizing these notes.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader eyebrow="Tool" title="Meeting Notes Summarizer">
        Paste raw or messy meeting notes below. They'll be condensed into a summary, key points,
        decisions, and action items with owners and deadlines.
      </PageHeader>

      <Panel>
        <Field label="Raw meeting notes">
          <textarea
            rows={8}
            className={inputClass}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your meeting notes here..."
          />
        </Field>

        <Button onClick={onSummarize} disabled={loading}>
          {loading ? (
            <>
              <Spinner /> Summarizing...
            </>
          ) : (
            "Summarize notes"
          )}
        </Button>

        <ErrorBox message={error} />

        {result && (
          <div className="mt-[22px] border-t border-border pt-5">
            <OutputLabel>
              Summary{" "}
              <span className="font-sans text-[11.5px] normal-case tracking-normal">
                — click any field to edit
              </span>
            </OutputLabel>

            <div className="grid gap-3.5">
              <NotesBlock title="Summary">
                <div
                  contentEditable
                  suppressContentEditableWarning
                  className={`text-[13.5px] leading-relaxed ${editable}`}
                >
                  {result.summary}
                </div>
              </NotesBlock>

              {result.key_points.length > 0 && (
                <NotesBlock title="Key Points">
                  <ul className="list-disc pl-[18px]">
                    {result.key_points.map((point, i) => (
                      <li
                        key={i}
                        contentEditable
                        suppressContentEditableWarning
                        className={`mb-1.5 text-[13.5px] leading-relaxed ${editable}`}
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                </NotesBlock>
              )}

              {result.decisions.length > 0 && (
                <NotesBlock title="Decisions">
                  <ul className="list-disc pl-[18px]">
                    {result.decisions.map((decision, i) => (
                      <li
                        key={i}
                        contentEditable
                        suppressContentEditableWarning
                        className={`mb-1.5 text-[13.5px] leading-relaxed ${editable}`}
                      >
                        {decision}
                      </li>
                    ))}
                  </ul>
                </NotesBlock>
              )}

              {result.action_items.length > 0 && (
                <NotesBlock title="Action Items">
                  {result.action_items.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between gap-3 border-b border-border py-[9px] text-[13.5px] last:border-b-0"
                    >
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        className={`flex-1 ${editable}`}
                      >
                        {item.task}
                      </span>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        className={`font-mono text-[11px] whitespace-nowrap text-teal ${editable}`}
                      >
                        {item.owner} · {item.deadline}
                      </span>
                    </div>
                  ))}
                </NotesBlock>
              )}
            </div>
          </div>
        )}
      </Panel>

      <Disclaimer>
        <b>Responsible AI notice:</b> action items with no clear owner or deadline in your notes
        are marked "Not specified" rather than guessed. Confirm details before assigning tasks.
      </Disclaimer>
    </>
  );
}
