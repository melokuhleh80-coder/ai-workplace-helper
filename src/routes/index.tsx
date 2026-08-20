import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, NotebookText, MessageCircle, ArrowRight } from "lucide-react";
import { PageHeader, Panel } from "@/components/ui-kit";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Three focused AI tools that cut the time you spend on workplace writing: email drafting, meeting note summaries, and a chat assistant.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Draft emails, summarize meeting notes, and get quick answers with AI built for the workday.",
      },
    ],
  }),
  component: Overview,
});

const tools = [
  {
    to: "/email" as const,
    icon: Mail,
    title: "Smart Email Generator",
    body: "Draft context-based professional emails with the right tone for the right audience.",
    tint: "bg-accent-soft text-accent",
  },
  {
    to: "/notes" as const,
    icon: NotebookText,
    title: "Meeting Notes Summarizer",
    body: "Turn long notes into a summary, key points, decisions, and action items.",
    tint: "bg-teal-soft text-teal",
  },
  {
    to: "/chat" as const,
    icon: MessageCircle,
    title: "Chat Assistant",
    body: "Ask a general workplace question and get a quick, practical answer.",
    tint: "bg-amber-soft text-amber",
  },
];

function Overview() {
  return (
    <>
      <PageHeader eyebrow="Dashboard" title="Good to see you, Melokuhle">
        Three AI tools to help automate the repetitive parts of your workday. Pick one below to
        get started.
      </PageHeader>

      <div className="mb-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map(({ to, icon: Icon, title, body, tint }) => (
          <Link
            key={to}
            to={to}
            className="rounded-md border border-border bg-surface px-5 py-[18px] shadow-panel transition-transform hover:-translate-y-0.5 hover:border-accent"
          >
            <div
              className={`mb-3.5 flex h-[38px] w-[38px] items-center justify-center rounded-sm ${tint}`}
            >
              <Icon className="h-[19px] w-[19px]" />
            </div>
            <h2 className="mb-1.5 text-[14.5px] font-bold">{title}</h2>
            <p className="text-[12.5px] leading-relaxed text-muted-foreground">{body}</p>
            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-accent">
              Open tool <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>
        ))}
      </div>

      <Panel className="px-5 py-[18px]">
        <h2 className="mb-2 text-sm font-bold">About this assistant</h2>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          This dashboard brings together three focused AI tools built to cut down time spent on
          repetitive workplace writing and admin. Every AI output is editable before you use it —
          nothing is sent or saved automatically. See the disclaimer on each tool page for more on
          responsible use.
        </p>
      </Panel>
    </>
  );
}
