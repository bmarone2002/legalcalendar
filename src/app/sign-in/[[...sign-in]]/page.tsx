import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
        <h1 className="mb-4 text-center text-lg font-semibold text-[var(--calendar-brown)] sm:text-xl">
          Accedi al tuo calendario legale
        </h1>
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: "bg-[var(--calendar-brown)] hover:bg-[var(--calendar-brown)]/90",
            },
          }}
        />
      </div>
    </div>
  );
}

