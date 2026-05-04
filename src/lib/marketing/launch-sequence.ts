import { prisma } from "@/lib/db";
import { getLaunchEmail, type LaunchStep } from "@/lib/marketing/launch-templates";
import { sendResendEmail } from "@/lib/marketing/resend";

const SETTING_KEY = "marketing:launch:state:v1";
const STEP_GAPS_DAYS = [2, 3] as const;

type ContactStatus = "active" | "completed";

type ContactSequenceState = {
  email: string;
  nextStep: LaunchStep;
  nextSendAt: string;
  status: ContactStatus;
  lastMessageId: string | null;
  updatedAt: string;
};

type LaunchState = {
  version: 1;
  contacts: Record<string, ContactSequenceState>;
  updatedAt: string;
};

type EnrollResult = {
  candidates: number;
  enrolled: number;
  alreadyPresent: number;
};

type RunResult = {
  scanned: number;
  sent: number;
  completed: number;
  failed: Array<{ email: string; error: string }>;
};

function getDefaultState(): LaunchState {
  return {
    version: 1,
    contacts: {},
    updatedAt: new Date().toISOString(),
  };
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

async function readState(): Promise<LaunchState> {
  const setting = await prisma.setting.findUnique({ where: { id: SETTING_KEY } });
  if (!setting) {
    return getDefaultState();
  }

  try {
    const parsed = JSON.parse(setting.value) as LaunchState;
    if (parsed.version !== 1 || !parsed.contacts) {
      return getDefaultState();
    }
    return parsed;
  } catch {
    return getDefaultState();
  }
}

async function saveState(state: LaunchState): Promise<void> {
  const payload = {
    ...state,
    updatedAt: new Date().toISOString(),
  };

  await prisma.setting.upsert({
    where: { id: SETTING_KEY },
    create: { id: SETTING_KEY, value: JSON.stringify(payload) },
    update: { value: JSON.stringify(payload) },
  });
}

function getNextSendAt(stepJustSent: LaunchStep, now: Date): string | null {
  if (stepJustSent === 2) {
    return null;
  }

  const gapDays = STEP_GAPS_DAYS[stepJustSent];
  const next = new Date(now);
  next.setUTCDate(next.getUTCDate() + gapDays);
  return next.toISOString();
}

function parseIsoOrNow(value: string): Date {
  const dt = new Date(value);
  return Number.isNaN(dt.getTime()) ? new Date() : dt;
}

export async function enrollLaunchContacts(inputEmails?: string[]): Promise<EnrollResult> {
  const state = await readState();
  const nowIso = new Date().toISOString();

  const emailsFromInput = inputEmails?.map(normalizeEmail).filter(Boolean) ?? [];
  const uniqueInput = Array.from(new Set(emailsFromInput));

  let candidates: string[] = uniqueInput;
  if (!uniqueInput.length) {
    const users = await prisma.user.findMany({
      where: { email: { not: null } },
      select: { email: true },
    });
    candidates = users
      .map((u) => (u.email ? normalizeEmail(u.email) : ""))
      .filter(Boolean);
    candidates = Array.from(new Set(candidates));
  }

  let enrolled = 0;
  let alreadyPresent = 0;

  for (const email of candidates) {
    if (state.contacts[email]) {
      alreadyPresent += 1;
      continue;
    }

    state.contacts[email] = {
      email,
      nextStep: 0,
      nextSendAt: nowIso,
      status: "active",
      lastMessageId: null,
      updatedAt: nowIso,
    };
    enrolled += 1;
  }

  if (enrolled > 0) {
    await saveState(state);
  }

  return {
    candidates: candidates.length,
    enrolled,
    alreadyPresent,
  };
}

export async function runLaunchSequence(): Promise<RunResult> {
  const state = await readState();
  const now = new Date();
  const from = process.env.MARKETING_FROM_EMAIL ?? process.env.SUPPORT_FROM_EMAIL;

  if (!from) {
    throw new Error("MARKETING_FROM_EMAIL or SUPPORT_FROM_EMAIL must be configured");
  }

  const contacts = Object.values(state.contacts);
  let sent = 0;
  let completed = 0;
  const failed: Array<{ email: string; error: string }> = [];

  for (const contact of contacts) {
    if (contact.status !== "active") {
      continue;
    }

    const dueAt = parseIsoOrNow(contact.nextSendAt);
    if (dueAt > now) {
      continue;
    }

    try {
      const step = contact.nextStep;
      const emailPayload = getLaunchEmail(step);
      const messageId = await sendResendEmail({
        from,
        to: contact.email,
        subject: emailPayload.subject,
        text: emailPayload.text,
        html: emailPayload.html,
      });

      sent += 1;
      contact.lastMessageId = messageId;
      contact.updatedAt = now.toISOString();

      const nextAt = getNextSendAt(step, now);
      if (!nextAt) {
        contact.status = "completed";
        completed += 1;
      } else {
        contact.nextStep = ((step + 1) as LaunchStep);
        contact.nextSendAt = nextAt;
      }
    } catch (error) {
      failed.push({
        email: contact.email,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  await saveState(state);

  return {
    scanned: contacts.length,
    sent,
    completed,
    failed,
  };
}

export async function getLaunchStateSummary() {
  const state = await readState();
  const contacts = Object.values(state.contacts);
  return {
    total: contacts.length,
    active: contacts.filter((c) => c.status === "active").length,
    completed: contacts.filter((c) => c.status === "completed").length,
    updatedAt: state.updatedAt,
  };
}
