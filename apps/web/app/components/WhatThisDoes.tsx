// /apps/web/app/components/WhatThisDoes.tsx
export default function WhatThisDoes() {
  const items = [
    {
      title: 'Upload & Process',
      desc: 'Upload PDFs, extract content, and prepare data for AI.',
    },
    {
      title: 'Semantic Search',
      desc: 'Find relevant content using meaning, not keywords.',
    },
    {
      title: 'Ask Questions (RAG)',
      desc: 'Get precise answers grounded in your documents.',
    },
    {
      title: 'Live Processing',
      desc: 'Track ingestion progress via real-time streaming.',
    },
  ];

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold mb-4">What this system does</h2>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {items.map((item) => (
          <div
            key={item.title}
            className="min-w-[240px] rounded-2xl border border-neutral-200 p-4"
          >
            <div className="text-sm font-semibold">{item.title}</div>
            <div className="text-xs text-neutral-500 mt-2">{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
