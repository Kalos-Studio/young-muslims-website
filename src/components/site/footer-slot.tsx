/**
 * Keeps the shared footer in the root layout while allowing it to be passed as
 * a server-rendered slot. Every route receives the same footer experience.
 */
export function FooterSlot({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
