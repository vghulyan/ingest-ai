// /apps/web/app/components/RagSection.tsx

export default function RagSection({
  query,
  setQuery,
  onAsk,
  answer,
}: {
  query: string;
  setQuery: (v: string) => void;
  onAsk: () => void;
  answer: string;
}) {
  return (
    <section className="rounded-2xl border p-6">
      <h2 className="text-lg font-medium">RAG</h2>

      <textarea value={query} onChange={(e) => setQuery(e.target.value)} />

      <button onClick={onAsk}>Ask</button>

      {answer && <div>{answer}</div>}
    </section>
  );
}
