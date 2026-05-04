import { NextResponse } from "next/server";
import { z } from "zod";
import {
  enrollLaunchContacts,
  getLaunchStateSummary,
  runLaunchSequence,
} from "@/lib/marketing/launch-sequence";

const requestSchema = z.object({
  action: z.enum(["enroll", "run", "enroll_and_run"]),
  emails: z.array(z.string().trim().email()).optional(),
});

function isAuthorized(req: Request): boolean {
  const token = process.env.MARKETING_CRON_TOKEN;
  if (!token) {
    return false;
  }

  const incoming =
    req.headers.get("x-marketing-token") ?? req.headers.get("authorization")?.replace("Bearer ", "");

  return incoming === token;
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const summary = await getLaunchStateSummary();
  return NextResponse.json({ success: true, summary });
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = requestSchema.parse(await req.json());
    const response: Record<string, unknown> = { success: true, action: payload.action };

    if (payload.action === "enroll" || payload.action === "enroll_and_run") {
      response.enroll = await enrollLaunchContacts(payload.emails);
    }

    if (payload.action === "run" || payload.action === "enroll_and_run") {
      response.run = await runLaunchSequence();
    }

    response.summary = await getLaunchStateSummary();
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid payload", details: error.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unexpected error",
      },
      { status: 500 }
    );
  }
}
