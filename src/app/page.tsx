import { CalendarView } from "@/components/calendar/CalendarView";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="border-b border-zinc-200 bg-white px-4 py-3">
        <h1 className="text-xl font-semibold text-[var(--calendar-brown)]">
          Calendario Legale
        </h1>
      </header>
      <main className="flex-1 p-4">
        <CalendarView />
      </main>
    </div>
  );
}
