import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#f5f0e6] via-[#f8f4ec] to-[var(--surface)] px-5 py-14 sm:px-8 sm:py-20"
    >
      <div className="w-full max-w-xl rounded-3xl border border-[var(--gold)]/20 bg-white/95 p-7 shadow-xl shadow-[var(--navy)]/10 backdrop-blur-sm sm:p-10">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.1em] text-[var(--gold)]">
          Accesso sicuro
        </p>
        <h1 className="mb-8 text-center text-xl font-semibold text-[var(--navy)] sm:text-2xl">
          Accedi alla tua Agenda Legale
        </h1>
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto w-full",
              card: "w-full max-w-none border-0 bg-transparent p-0 shadow-none",
            },
          }}
        />
      </div>
    </div>
  );
}

