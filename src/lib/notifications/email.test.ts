import { afterEach, describe, expect, it, vi } from "vitest";

import {
  isSmtpConfigured,
  readSmtpConfig,
  sendRequestEmailNotification,
  setMailSenderForTests,
} from "./email";
import type { NormalizedRequest } from "@/lib/requests/types";

const sampleRequest: NormalizedRequest = {
  clientType: "individual",
  name: "Test User",
  phone: "+79001234567",
  sourceForm: "contact",
  items: [],
};

const envBackup: Record<string, string | undefined> = {};

function setEnv(key: string, value: string | undefined) {
  envBackup[key] = process.env[key];
  if (value === undefined) delete process.env[key];
  else process.env[key] = value;
}

afterEach(() => {
  setMailSenderForTests(null);
  for (const [key, value] of Object.entries(envBackup)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

describe("email notifications", () => {
  it("reports not configured when env is missing", () => {
    delete process.env.SMTP_HOST;
    expect(isSmtpConfigured()).toBe(false);
  });

  it("reads SMTP config from env", () => {
    setEnv("SMTP_HOST", "smtp.example.com");
    setEnv("SMTP_PORT", "587");
    setEnv("SMTP_FROM", "noreply@bizon.ru");
    setEnv("REQUESTS_EMAIL_TO", "sales@bizon.ru");
    expect(readSmtpConfig()?.host).toBe("smtp.example.com");
    expect(isSmtpConfigured()).toBe(true);
  });

  it("skips send when SMTP is not configured", async () => {
    delete process.env.SMTP_HOST;
    const result = await sendRequestEmailNotification(sampleRequest, 1);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.skipped).toBe(true);
  });

  it("sends when configured with injected transport", async () => {
    setEnv("SMTP_HOST", "smtp.example.com");
    setEnv("SMTP_PORT", "587");
    setEnv("SMTP_FROM", "noreply@bizon.ru");
    setEnv("REQUESTS_EMAIL_TO", "sales@bizon.ru");

    const sendMail = vi.fn().mockResolvedValue({});
    setMailSenderForTests({ sendMail });

    const result = await sendRequestEmailNotification(sampleRequest, 42);
    expect(result.ok).toBe(true);
    expect(sendMail).toHaveBeenCalledOnce();
    expect(sendMail.mock.calls[0]?.[0]?.subject).toContain("42");
  });

  it("returns error when transport fails", async () => {
    setEnv("SMTP_HOST", "smtp.example.com");
    setEnv("SMTP_PORT", "587");
    setEnv("SMTP_FROM", "noreply@bizon.ru");
    setEnv("REQUESTS_EMAIL_TO", "sales@bizon.ru");

    setMailSenderForTests({
      sendMail: vi.fn().mockRejectedValue(new Error("connection refused")),
    });

    const result = await sendRequestEmailNotification(sampleRequest, 1);
    expect(result.ok).toBe(false);
    if (result.ok === false && result.skipped !== true) {
      expect(result.error).toContain("connection refused");
    }
  });
});
