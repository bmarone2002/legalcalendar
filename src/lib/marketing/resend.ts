type SendEmailParams = {
  to: string | string[];
  from: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};

type ResendSendResponse = {
  id?: string;
};

export async function sendResendEmail(params: SendEmailParams): Promise<string | null> {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY not configured");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: params.from,
      to: params.to,
      subject: params.subject,
      text: params.text,
      html: params.html,
      reply_to: params.replyTo,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend send failed (${response.status}): ${body}`);
  }

  const payload = (await response.json()) as ResendSendResponse;
  return payload.id ?? null;
}
