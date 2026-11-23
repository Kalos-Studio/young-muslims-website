# Contact email setup

The contact form sends plain-text email through Resend from a Next.js Server Action.
Visitors must select Brothers or Sisters. Each submission goes only to the selected
team's inbox. The visitor’s address is used as Reply-To; the sender and recipients
are configured only on the server. No Resend SDK dependency is required.

Set these environment variables in `.env.local` for local development and in
Vercel’s project environment settings for the deployed site:

```dotenv
RESEND_API_KEY=re_your_sending_api_key
CONTACT_FROM_EMAIL="Young Muslims <kalos@youngmuslims.com>"
CONTACT_BROTHERS_EMAIL=muneeb.syed@youngmuslims.com
CONTACT_SISTERS_EMAIL=shura@ymsisters.com
```

Verify a domain in Resend and use a sender address on that domain. Create a
sending API key restricted to that domain. Never prefix these variables with
`NEXT_PUBLIC_` or commit real credentials. Restart development or redeploy after
setting the variables. Enable the variables for Production in Vercel; use test
recipients for Preview deployments. `CONTACT_TO_EMAIL` is no longer used and can
be removed. `.env.local` is only needed for local testing and is ignored by Git.

The form validates required fields and length limits on both client and server,
keeps entered text after errors, disables repeat clicks while sending, and includes
a honeypot for basic spam filtering. Next.js Server Actions enforce same-origin
requests. The honeypot is not a rate limiter; configure hosting-level rate limits
or bot protection if the public form attracts automated abuse.

After configuring production, submit a test for each team through `/contact`,
confirm each arrives only at the matching inbox, and verify Reply addresses the visitor. An on-screen
success means Resend accepted the email; use the Resend dashboard to investigate
delivery or bounce events. No live email is sent by the automated tests.

API reference: https://resend.com/docs/api-reference/emails/send-email
