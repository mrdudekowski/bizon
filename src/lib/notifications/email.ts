import nodemailer from "nodemailer";
import type Transporter from "nodemailer/lib/mailer";

import { formatRequestPlainText } from "@/lib/requests/formatRequestForTelegram";
import type { NormalizedRequest } from "@/lib/requests/types";

export type EmailSendResult =
  | { ok: true; skipped?: false }
  | { ok: false; skipped: true; reason: string }
  | { ok: false; skipped?: false; error: string };

export type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  from: string;
  to: string;
  user?: string;
  pass?: string;
};

export type MailSender = {
  sendMail: (options: {
    from: string;
    to: string;
    subject: string;
    text: string;
  }) => Promise<unknown>;
};

const SMTP_TIMEOUT_MS = 15_000;

let mailSenderOverride: MailSender | null = null;

export function setMailSenderForTests(sender: MailSender | null): void {
  mailSenderOverride = sender;
}

export function readSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST?.trim();
  const portRaw = process.env.SMTP_PORT?.trim();
  const from = process.env.SMTP_FROM?.trim();
  const to = process.env.REQUESTS_EMAIL_TO?.trim();

  if (!host || !portRaw || !from || !to) return null;

  const port = Number.parseInt(portRaw, 10);
  if (!Number.isFinite(port) || port <= 0) return null;

  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();

  return {
    host,
    port,
    secure: port === 465,
    from,
    to,
    ...(user ? { user } : {}),
    ...(pass ? { pass } : {}),
  };
}

export function isSmtpConfigured(): boolean {
  return readSmtpConfig() !== null;
}

function createTransport(config: SmtpConfig): Transporter {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    ...(config.user && config.pass
      ? { auth: { user: config.user, pass: config.pass } }
      : {}),
    connectionTimeout: SMTP_TIMEOUT_MS,
    greetingTimeout: SMTP_TIMEOUT_MS,
    socketTimeout: SMTP_TIMEOUT_MS,
  });
}

function getMailSender(config: SmtpConfig): MailSender {
  if (mailSenderOverride) return mailSenderOverride;
  const transport = createTransport(config);
  return {
    sendMail: (options) =>
      transport.sendMail({
        from: options.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
      }),
  };
}

export async function sendRequestEmailNotification(
  data: NormalizedRequest,
  requestId: string | number,
  adminRequestUrl?: string,
): Promise<EmailSendResult> {
  const config = readSmtpConfig();
  if (!config) {
    return { ok: false, skipped: true, reason: "SMTP not configured" };
  }

  const subject = `BIZON заявка #${requestId} — ${data.name}`;
  const text = formatRequestPlainText(data, adminRequestUrl);

  try {
    const sender = getMailSender(config);
    await sender.sendMail({
      from: config.from,
      to: config.to,
      subject,
      text,
    });
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "SMTP send failed";
    console.error("[notifications/email] send failed", { requestId, error: message });
    return { ok: false, error: message };
  }
}
