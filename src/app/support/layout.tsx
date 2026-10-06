import { FundraiseUpScript } from "@/components/fundraise-up/fundraise-up-script";

/** Loads the donation provider only for the part of the site that uses it. */
export default function SupportLayout({ children }: LayoutProps<"/support">) {
  return (
    <>
      <FundraiseUpScript />
      {children}
    </>
  );
}
