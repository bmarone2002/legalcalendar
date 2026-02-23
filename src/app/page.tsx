import { CalendarView } from "@/components/calendar/CalendarView";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="border-b border-zinc-200 bg-white px-3 py-2 sm:px-4 sm:py-3 md:px-6">
        <h1 className="text-lg font-semibold text-[var(--calendar-brown)] sm:text-xl">
          Calendario Legale
        </h1>
      </header>
      <main className="flex-1 p-3 sm:p-4 md:p-5 lg:p-6">
        <CalendarView />
      </main>
    </div>
  );
}
