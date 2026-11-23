"use client";

import { useActionState, useState } from "react";
import { sendContactMessage, type ContactState } from "./actions";

const inputClass =
  "w-full rounded-media border border-input bg-background px-4 py-3 text-body text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(
    sendContactMessage,
    {
      status: "idle",
      message: "",
    },
  );
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [team, setTeam] = useState("");

  return (
    <div className="mt-8" data-contact-form-slot>
      {state.status !== "success" && (
        <form
          action={action}
          className="flex flex-col gap-6"
          aria-busy={pending}
        >
          <fieldset>
            <legend className="mb-4 text-body font-semibold">
              Who would you like to contact?
            </legend>
            <div className="grid grid-cols-2 gap-4">
              {(["brothers", "sisters"] as const).map((option) => (
                <label key={option} className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="team"
                    value={option}
                    required
                    checked={team === option}
                    onChange={() => setTeam(option)}
                    className="peer sr-only"
                  />
                  <span className="block rounded-media border border-input px-4 py-3 text-center text-body font-semibold peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2">
                    {option === "brothers" ? "Brothers" : "Sisters"}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="flex flex-col gap-2">
            <label htmlFor="contact-name" className="text-body font-semibold">
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              autoComplete="name"
              required
              maxLength={100}
              className={inputClass}
              value={values.name}
              onChange={(event) =>
                setValues({ ...values, name: event.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="contact-email" className="text-body font-semibold">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              className={inputClass}
              value={values.email}
              onChange={(event) =>
                setValues({ ...values, email: event.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="contact-message"
              className="text-body font-semibold"
            >
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              maxLength={5000}
              rows={5}
              className={inputClass}
              value={values.message}
              onChange={(event) =>
                setValues({ ...values, message: event.target.value })
              }
            />
          </div>
          <div className="hidden" aria-hidden="true">
            <label htmlFor="contact-website">Leave this field empty</label>
            <input
              id="contact-website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="rounded-media bg-primary px-6 py-3 text-body font-semibold text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-wait disabled:opacity-50"
          >
            {pending ? "Sending…" : "Send message"}
          </button>
        </form>
      )}
      <p role="status" aria-live="polite" className="mt-4 text-body">
        {state.message}
      </p>
    </div>
  );
}
