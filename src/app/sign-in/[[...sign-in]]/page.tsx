import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ backgroundColor: "var(--surface)" }}>
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-md sm:p-8">
        <h1 className="mb-6 text-center text-lg font-semibold text-[var(--navy)] sm:text-xl">
          Accedi alla tua Agenda Legale
        </h1>
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: "bg-[var(--navy)] hover:bg-[var(--navy-light)]",
            },
          }}
        />
      </div>
    </div>
  );
}

