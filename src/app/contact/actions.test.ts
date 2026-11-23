import { test } from "node:test";
import assert from "node:assert/strict";
import { sendContactMessage } from "./actions";

test("contact validation, delivery, and provider failures", async () => {
  const originalFetch = globalThis.fetch;
  const originalEnv = { ...process.env };
  const initial = { status: "idle" as const, message: "" };
  const data = () => {
    const form = new FormData();
    form.set("team", "brothers");
    form.set("name", "Test Visitor");
    form.set("email", "visitor@example.com");
    form.set("message", "A test message <not HTML>.");
    return form;
  };
  let calls = 0;
  try {
    process.env.RESEND_API_KEY = "test-key";
    process.env.CONTACT_FROM_EMAIL = "YM <contact@example.com>";
    process.env.CONTACT_BROTHERS_EMAIL = "brothers@example.com";
    process.env.CONTACT_SISTERS_EMAIL = "sisters@example.com";
    let expectedTeam = "Brothers";
    globalThis.fetch = (async (_url, options) => {
      calls++;
      const payload = JSON.parse(options?.body as string);
      assert.equal(payload.from, "YM <contact@example.com>");
      assert.deepEqual(payload.to, [
        `${expectedTeam.toLowerCase()}@example.com`,
      ]);
      assert.equal(
        payload.subject,
        `New Young Muslims ${expectedTeam} contact message`,
      );
      assert.equal(payload.reply_to, "visitor@example.com");
      assert.match(payload.text, /A test message <not HTML>/);
      assert.equal(payload.html, undefined);
      return Response.json({ id: "test-message" });
    }) as typeof fetch;
    assert.equal((await sendContactMessage(initial, data())).status, "success");
    assert.equal(calls, 1);
    expectedTeam = "Sisters";
    const sisters = data();
    sisters.set("team", "sisters");
    sisters.set("to", "untrusted@example.com");
    assert.equal(
      (await sendContactMessage(initial, sisters)).status,
      "success",
    );
    assert.equal(calls, 2);
    delete process.env.CONTACT_SISTERS_EMAIL;
    assert.equal((await sendContactMessage(initial, sisters)).status, "error");
    expectedTeam = "Brothers";
    // Missing Sisters configuration must not prevent Brothers delivery.
    assert.equal((await sendContactMessage(initial, data())).status, "success");
    assert.equal(calls, 3);
    const missingTeam = data();
    missingTeam.delete("team");
    assert.equal(
      (await sendContactMessage(initial, missingTeam)).status,
      "error",
    );

    for (const [key, value] of [
      ["team", ""],
      ["team", "other"],
      ["team", "untrusted@example.com"],
      ["name", " "],
      ["name", "Name\r\nHeader"],
      ["email", "invalid"],
      ["email", "test@example.com\r\nBcc:x@y.com"],
      ["message", " "],
      ["message", "a".repeat(5001)],
    ]) {
      const form = data();
      form.set(key, value);
      assert.equal((await sendContactMessage(initial, form)).status, "error");
    }
    const bot = data();
    bot.set("website", "spam");
    assert.equal((await sendContactMessage(initial, bot)).status, "success");
    assert.equal(calls, 3);

    delete process.env.RESEND_API_KEY;
    assert.equal((await sendContactMessage(initial, data())).status, "error");
    assert.equal(calls, 3);
    process.env.RESEND_API_KEY = "test-key";
    globalThis.fetch = (async () =>
      new Response(null, { status: 429 })) as typeof fetch;
    assert.equal((await sendContactMessage(initial, data())).status, "error");
    globalThis.fetch = (async () => {
      throw new Error("network failure");
    }) as typeof fetch;
    assert.equal((await sendContactMessage(initial, data())).status, "error");
    globalThis.fetch = (async () => Response.json({})) as typeof fetch;
    assert.equal((await sendContactMessage(initial, data())).status, "error");
  } finally {
    globalThis.fetch = originalFetch;
    for (const key of [
      "RESEND_API_KEY",
      "CONTACT_FROM_EMAIL",
      "CONTACT_BROTHERS_EMAIL",
      "CONTACT_SISTERS_EMAIL",
    ]) {
      if (originalEnv[key] === undefined) delete process.env[key];
      else process.env[key] = originalEnv[key];
    }
  }
});
