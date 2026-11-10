/**
 * Spread onto an element inside a TextReveal (a button or link, say) to
 * reveal it whole, as its own line, instead of splitting its text.
 *
 * It lives outside text-reveal.tsx because that is a Client Component
 * module: a Server Component importing a plain value from it receives a
 * client reference, not the object, and spreading that adds nothing.
 */
export const textRevealUnit = { "data-text-reveal-unit": "" } as const;
