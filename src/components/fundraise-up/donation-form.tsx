const DONATION_FORM_ELEMENT_ID = "XGSJWDBQ";

/**
 * Fundraise Up replaces this marker with the configured Donation Form, an
 * iframe 450px tall: the marker holds that height while it loads, so nothing
 * shifts. It has no surface of its own; the page frames it (support-hero.tsx).
 */
export function FundraiseUpDonationForm() {
  return (
    <div className="min-h-112.5" data-fundraise-up-donation-form>
      <a href={`#${DONATION_FORM_ELEMENT_ID}`} style={{ display: "none" }} />
    </div>
  );
}
