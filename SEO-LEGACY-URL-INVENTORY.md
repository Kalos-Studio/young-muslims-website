# Legacy URL inventory and proposed migration destinations

Source: site-owner-provided list, received 2026-10-02. These 14 URLs are recorded
for SEO-03 and will inform SEO-22. A public audit on 2026-10-02 verified all 14:
HTTP 200, no redirects, self-referencing canonical URLs, and index/follow HTML
robots metadata. See [the audit report](SEO-LEGACY-AUDIT.md) for 138 checked URLs,
additional articles, 20 PDF checks, and sitemap discoveries. Traffic and backlinks
remain unverified. This document does not configure redirects or establish that
the legacy inventory is complete.

Destination paths below are relative to `https://youngmuslims.com`. Mappings
reflect the owner's requested page associations; redirect readiness remains
pending content and hosting checks. All destination routes already exist.

## URL mapping

| ID     | Legacy URL                                     | Intended destination | Content or migration check before redirecting                                                                                               |
| ------ | ---------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| LEG-01 | https://ymsite.com/                            | `/`                  | Confirm the new homepage represents the consolidated organization.                                                                          |
| LEG-02 | https://ymsite.com/about-young-muslims/        | `/about`             | Preserve relevant organization information.                                                                                                 |
| LEG-03 | https://ymsite.com/our-programs/neighbornets/  | `/neighbornets`      | Preserve program explanation and joining instructions.                                                                                      |
| LEG-04 | https://ymsite.com/resources/                  | `/blog`              | Preserve access to resources; inventory individual articles and downloads separately.                                                       |
| LEG-05 | https://ymsisters.com/                         | `/`                  | Confirm the consolidated homepage represents sisters' participation and programs.                                                           |
| LEG-06 | https://ymsisters.com/who-we-are-2/            | `/about`             | Preserve relevant sisters' organization information.                                                                                        |
| LEG-07 | https://ymsisters.com/leadership/              | `/about`             | Include relevant leadership information in the destination.                                                                                 |
| LEG-08 | https://ymsisters.com/for-parents/             | `/about`             | Include the parent-facing information the legacy page provides.                                                                             |
| LEG-09 | https://ymsisters.com/faq/                     | `/about`             | Review and migrate applicable questions into the About FAQ.                                                                                 |
| LEG-10 | https://ymsisters.com/locations/               | `/neighbornets`      | Verify sisters' locations and contact/joining information.                                                                                  |
| LEG-11 | https://ymsisters.com/start-a-new-neighbornet/ | `/neighbornets`      | Preserve chapter-starting instructions and any form or contact destination.                                                                 |
| LEG-12 | https://ymsisters.com/our-programs/            | `/neighbornets`      | Check whether all programs are represented; retain access to any that extend beyond local groups.                                           |
| LEG-13 | https://ymsisters.com/donation-confirmation/   | `/support`           | Owner-requested association. Review payment return URLs, confirmation messaging, and conversion tracking before choosing redirect behavior. |
| LEG-14 | https://giving.ymsite.com/page/YM2026          | `/support`           | Verify the giving subdomain's platform, campaign terms, donation behavior, and tracking before retiring the campaign URL.                   |

## Redirect implementation requirements (SEO-22)

- [ ] Check each source URL's response, current destination, and content; record
      findings against its LEG ID. Inspect HTTP/HTTPS and `www`/apex variants where
      applicable, plus trailing-slash and campaign-query behavior.
- [ ] Review destination content for equivalence, especially merged About and
      NeighborNets pages. Multiple source pages may share a destination when their
      useful content is consolidated there.
- [ ] Confirm whether LEG-13 is an active payment return/thank-you endpoint.
      Preserve successful-donation confirmation and prevent duplicate or false
      conversion events. Do not treat a visit to `/support` as proof of payment.
- [ ] Confirm control of `giving.ymsite.com` independently of the main website.
      Record its platform/owner and coordinate LEG-14 with donation integration.
- [ ] Configure direct permanent HTTP redirects for approved retired content
      URLs at the source host/CDN. DNS alone does not implement these redirects.
      Handle active transactional endpoints according to the reviewed donation flow.
- [ ] Test that each redirect reaches its intended `200` destination without a
      loop or chain, and does not break forms, donation completion, or campaign tracking.
- [ ] Keep legacy domains, certificates, and redirect hosting active; update
      owned links to the new destinations after successful cutover.

No source redirect is approved as operationally tested by this inventory alone.
The all-page indexing decision for the new website does not imply that old
transactional confirmation URLs should be indexed or included in the new sitemap.

## Remaining inventory and baseline work (SEO-03)

- [x] Record the 14 supplied legacy URLs and their intended destinations.
- [x] Verify all 14 supplied live URLs and inspect public sitemap indexes and
      resource pages; record findings in [SEO-LEGACY-AUDIT.md](SEO-LEGACY-AUDIT.md).
- [ ] Compare the supplied list with legacy sitemaps, navigation, and CMS exports.
      Include existing content on `youngmuslims.com` if it is also being replaced.
- [ ] Inventory individual articles, PDFs, downloads, linked media, and additional
      campaign pages. The resources landing page is not a substitute for these URLs.
- [ ] Record source HTTP status, canonical, intended disposition, and verification
      date for each URL. Add discoveries to this inventory rather than assuming they
      all redirect to the homepage.
- [ ] Obtain dated Search Console exports for queries and pages: clicks,
      impressions, click-through rate, and average position, with reporting period
      and domain/property identified. Prefer a comparable historical period and
      retain up to 16 months of available history.
- [ ] Obtain available backlink/top-linked-page reports and organic landing-page
      and conversion data. Record missing or inaccessible data explicitly.
- [ ] Save references to exports in the evidence table; keep private reports in
      an appropriate access-controlled location rather than committing them by default.

| Evidence                              | Status                                              | Location / reporting period                     |
| ------------------------------------- | --------------------------------------------------- | ----------------------------------------------- |
| Owner-supplied URL list               | Recorded                                            | LEG-01 through LEG-14 above                     |
| Live crawl / sitemap comparison       | Public audit completed; completeness review pending | [Audit report](SEO-LEGACY-AUDIT.md), 2026-10-02 |
| Search Console queries and pages      | Pending access or export                            | Not yet supplied                                |
| Backlink reports                      | Pending access or export                            | Not yet supplied                                |
| Organic landing pages and conversions | Pending access or export                            | Not yet supplied                                |

SEO-03 remains in progress: public URL verification and resource discovery are
recorded, but CMS/orphan-page completeness checks, review of unvisited sitemap
entries, and the dated search-performance baseline remain outstanding.
See [SEO-CHECKLIST.md](SEO-CHECKLIST.md) and the
[new-site route inventory](SEO-ROUTE-INVENTORY.md).
