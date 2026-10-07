const DONATION_FORM_ELEMENT_ID = "XGSJWDBQ";

/** Fundraise Up replaces this marker with the configured Donation Form. */
export function FundraiseUpDonationForm() {
  return (
    <div
      className="min-h-[32rem] rounded-card bg-brand-pure-white"
      data-fundraise-up-donation-form
    >
      <a href={`#${DONATION_FORM_ELEMENT_ID}`} style={{ display: "none" }} />
    </div>
  );
}
