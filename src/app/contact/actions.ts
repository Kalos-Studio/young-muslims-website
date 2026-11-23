"use server";

export type ContactState = {
  status: "idle" | "error" | "success";
  message: string;
};

const success: ContactState = {
  status: "success",
  message: "Thank you for reaching out! Your message has been sent.",
};

export async function sendContactMessage(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const field = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value.trim() : "";
  };

  // Honeypot: ignore automated submissions without sending email.
  if (field("website")) return success;

  const team = field("team");
  if (team !== "brothers" && team !== "sisters") {
    return { status: "error", message: "Please choose Brothers or Sisters." };
  }

  const name = field("name");
  const email = field("email");
  const message = field("message");
  if (
    !name ||
    name.length > 100 ||
    /[\r\n]/.test(name) ||
    email.length > 254 ||
    !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) ||
    !message ||
    message.length > 5000
  ) {
    return {
      status: "error",
      message:
        "Please enter your name, a valid email address, and a message of up to 5,000 characters.",
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  // Only server-configured inboxes may receive messages, never a posted address.
  const to =
    team === "brothers"
      ? process.env.CONTACT_BROTHERS_EMAIL
      : process.env.CONTACT_SISTERS_EMAIL;
  const teamLabel = team === "brothers" ? "Brothers" : "Sisters";
  const failure: ContactState = {
    status: "error",
    message:
      "We couldn’t send your message. Please try again shortly. Your message is still here.",
  };
  if (!apiKey || !from || !to) {
    console.error("Contact email configuration is missing.");
    return failure;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `New Young Muslims ${teamLabel} contact message`,
        text: `Team: ${teamLabel}\nName: ${name}\nEmail: ${email}\n\n${message}`,
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) {
      // Do not log visitor data, credentials, or provider response bodies.
      console.error(
        "Contact email provider rejected request:",
        response.status,
      );
      return failure;
    }
    const result = await response.json();
    return typeof result.id === "string" && result.id ? success : failure;
  } catch {
    console.error("Contact email request failed.");
    return failure;
  }
}
