const SECTIONS = [
  {
    icon: '🧭',
    title: 'What is this app?',
    content: `Company Simulator puts you inside a small SaaS startup and lets you make the decisions that shape it. Every choice — hiring, releasing, managing tech debt — changes the company's metrics in real time.

The goal is not to win. The goal is to understand how decisions connect: why fixing bugs before hiring sales leads to a different outcome than doing it the other way around, and what that looks like across two years.`,
  },
  {
    icon: '🔄',
    title: 'Flows — your simulation sessions',
    items: [
      { label: 'What is a flow?', text: 'A flow is one simulation session. It has its own company state, metric history, and decision log. Think of it as one "playthrough".' },
      { label: 'Active flow', text: 'The flow currently in play. You can make decisions in it. Only one flow is active at a time.' },
      { label: 'Inactive flow', text: 'A past session. You can browse its state and history in read-only mode — useful for comparing outcomes.' },
      { label: '↺ Reset & New Flow', text: 'Deactivates the current flow and starts a fresh one from the default company state. The old flow is not deleted — you can still view it from the flow selector.' },
    ],
  },
  {
    icon: '🏢',
    title: 'Dashboard',
    content: 'Shows the live state of your company, organised by role. Each card displays the KPIs that role owns. Metrics are on a 0–100 scale. After applying a decision in the Playground, come back here to see the impact.',
  },
  {
    icon: '👤',
    title: 'Role Explorer',
    content: 'Select a role to see what they are responsible for, what they do day-to-day, and which KPIs they are measured on. Use this to understand whose metrics a decision will affect before you make it.',
  },
  {
    icon: '🔄',
    title: 'Workflow Visualizer',
    content: 'Shows the end-to-end product lifecycle — from Idea through to Feedback — and which roles are involved at each stage. Useful for understanding where bottlenecks form when a team is understaffed in a particular role.',
  },
  {
    icon: '🎯',
    title: 'Decision Playground',
    items: [
      { label: 'Pick a decision', text: 'Choose from the 5 decision types at the top: hiring, bug vs feature, tech debt, release strategy, and sales.' },
      { label: 'Choose an option', text: 'Each decision has 2 options. The impacts are applied to your active flow immediately.' },
      { label: 'Team Reaction', text: 'After choosing, you see each role\'s agreement score (0–100%). Green = agrees, amber = neutral, red = disagrees. A decision that helps engineering often hurts sales and vice versa.' },
      { label: '✦ Explain this decision (AI)', text: 'After applying a decision, click this button to get an AI analysis of why the metrics moved the way they did and what risks to watch in the next quarter. Powered by a local Ollama model — takes a few seconds.' },
      { label: 'View-only mode', text: 'If you are viewing an inactive flow, the option buttons are disabled. You can still read the decisions and reactions.' },
    ],
  },
  {
    icon: '📜',
    title: 'Decision History',
    content: 'A reverse-chronological timeline of every decision made in the selected flow. Click any entry to expand it and see the full team reaction and metric changes. Works on both active and inactive flows — great for post-game review.',
  },
  {
    icon: '🎬',
    title: 'Scenarios',
    items: [
      { label: 'What is a scenario?', text: 'A guided 2-year playthrough with pre-chosen decisions, each with business and market context explaining why the decision was made.' },
      { label: 'Play This Scenario', text: 'Starts a new active flow named after the scenario. Your previous active flow becomes inactive (still viewable).' },
      { label: 'Step-by-step', text: 'Each step shows the quarter, what decision is being made, the business context, and the market impact. Click Apply to commit the decision and see the team reaction.' },
      { label: 'Available scenarios', text: '① The Disciplined Builder (positive, general SaaS) — stability-first, trust compounds. ② Growth at All Costs (negative, general SaaS) — speed over fundamentals, churn kills runway. ③ The Responsible AI Builder (positive, AI startup) — reliability over hype, enterprise trust. ④ The AI Hype Machine (negative, AI startup) — viral launch, hallucinations, broken unit economics.' },
    ],
  },
  {
    icon: '💡',
    title: 'Tips',
    items: [
      { label: 'Compare flows', text: 'Run the two contrasting scenarios (e.g. Disciplined Builder vs Growth at All Costs), then use the flow selector to switch between them and compare the final Dashboard states side by side.' },
      { label: 'Metrics are clamped', text: 'No metric goes below 0 or above 100. A decision that would push a metric past the cap still applies — it just stops at the boundary.' },
      { label: 'AI explainer works best after impactful decisions', text: 'The explanation is most useful when multiple metrics move. Try "Ignore Tech Debt" or "Release Fast" for rich analysis.' },
      { label: 'Free play after scenarios', text: 'After finishing a scenario, the flow stays active. You can keep making free decisions in the Playground to deviate from the scripted path.' },
    ],
  },
];

function Section({ section }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h3 style={{ margin: '0 0 14px', fontSize: 17, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span>{section.icon}</span>
        <span>{section.title}</span>
      </h3>

      {section.content && (
        <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.8, margin: 0, whiteSpace: 'pre-line' }}>
          {section.content}
        </p>
      )}

      {section.items && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {section.items.map(item => (
            <div key={item.label} style={{ background: '#0f172a', borderRadius: 8, padding: '12px 16px', display: 'flex', gap: 14 }}>
              <span style={{ color: '#3b82f6', fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', minWidth: 160, flexShrink: 0 }}>
                {item.label}
              </span>
              <span style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.7 }}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Guide() {
  return (
    <div style={{ padding: 32, maxWidth: 860, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 6 }}>📖 How to Use</h2>
      <p style={{ color: '#64748b', fontSize: 14, marginBottom: 40 }}>
        A quick reference for every feature in Company Simulator.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {SECTIONS.map((section, i) => (
          <div key={section.title}>
            <Section section={section} />
            {i < SECTIONS.length - 1 && (
              <div style={{ borderBottom: '1px solid #1e293b', marginBottom: 36 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
