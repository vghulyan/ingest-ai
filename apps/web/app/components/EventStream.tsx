// /apps/web/app/components/EventStream.tsx
type DocEvent = {
  documentId: string;
  stage: string;
  message: string;
};

export default function EventStream({
  events,
  connected,
}: {
  events: DocEvent[];
  connected: boolean;
}) {
  return (
    <section className="rounded-2xl border p-6">
      <div className="flex justify-between">
        <h2 className="text-lg font-medium">Processing</h2>
        <span className="text-xs">{connected ? 'LIVE' : 'OFF'}</span>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {events.map((e, i) => (
          <div key={i} className="text-sm">
            {e.stage} — {e.message}
          </div>
        ))}
      </div>
    </section>
  );
}
