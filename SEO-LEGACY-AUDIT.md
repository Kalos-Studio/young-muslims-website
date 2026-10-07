# Legacy public-site audit

Verified 2026-10-02 (America/Chicago); requests finished 2026-10-03T02:25:45.713Z UTC.

## Findings

- All 14 owner-supplied URLs returned HTTP 200 with no redirects, self-referencing canonicals, and index/follow HTML robots metadata. This confirms reachability, not Google indexing or correct payment behavior.
- 138 distinct URLs checked across the public crawl and targeted follow-ups. The initial crawl was capped at 130 requests; its 179 queued URLs were not all fetched. Sitemap discovery is broader than the set of verified pages.
- 20 PDF URLs checked using HEAD: 17 returned 200 with application/pdf; three returned 404. Document bodies were not downloaded or reviewed for correctness.
- Three additional HTML URLs returned 404. No supplied URL was among the 404s.
- youngmuslims.com currently forwards to ymsite.com. Reverse this legacy forwarding during cutover before redirecting ymsite.com back to youngmuslims.com, to prevent a loop.
- Sisters' program headings include regional events, study circles, conferences, leadership conferences, and activism. Confirm that merging this page into /neighbornets preserves access to these programs.
- Public page inspection does not confirm that donation-confirmation is safe to redirect; inspect the payment return flow separately.

[Machine-readable evidence](data/seo/legacy-public-audit.json) contains response metadata, canonical URLs, robots values, sitemap-discovered URLs, and resource source links. Re-run the read-only crawler with `node scripts/audit-legacy-urls.mjs`; pass explicit URLs to limit it to those URLs.

## Supplied URLs: live verification

All final URLs and canonicals below equal their requested URL. Titles are the current source titles, not proposed replacement copy.

| ID     | Requested URL                                  | GET status | Title                                                        |
| ------ | ---------------------------------------------- | ---------- | ------------------------------------------------------------ |
| LEG-01 | https://ymsite.com/                            | 200        | Young Muslims - Largest Muslim Youth Organization in the US  |
| LEG-02 | https://ymsite.com/about-young-muslims/        | 200        | Who We Are \| About Young Muslims (YM)                       |
| LEG-03 | https://ymsite.com/our-programs/neighbornets/  | 200        | YM NeighborNets : Brotherhood & Islamic Values Across the US |
| LEG-04 | https://ymsite.com/resources/                  | 200        | Resources \| Young Muslims Islamic Library                   |
| LEG-05 | https://ymsisters.com/                         | 200        | Young Muslims Sisters                                        |
| LEG-06 | https://ymsisters.com/who-we-are-2/            | 200        | Who We Are - Young Muslims Sisters                           |
| LEG-07 | https://ymsisters.com/leadership/              | 200        | Leadership - Young Muslims Sisters                           |
| LEG-08 | https://ymsisters.com/for-parents/             | 200        | For Parents - Young Muslims Sisters                          |
| LEG-09 | https://ymsisters.com/faq/                     | 200        | FAQ - Young Muslims Sisters                                  |
| LEG-10 | https://ymsisters.com/locations/               | 200        | Locations - Young Muslims Sisters                            |
| LEG-11 | https://ymsisters.com/start-a-new-neighbornet/ | 200        | START A NEW NEIGHBORNET! - Young Muslims Sisters             |
| LEG-12 | https://ymsisters.com/our-programs/            | 200        | Our Programs - Young Muslims Sisters                         |
| LEG-13 | https://ymsisters.com/donation-confirmation/   | 200        | Donation Confirmation - Young Muslims Sisters                |
| LEG-14 | https://giving.ymsite.com/page/YM2026          | 200        | Support Young Muslims                                        |

## Sitemap discovery

Both robots.txt files advertise their sitemap indexes. All listed sitemap requests returned 200. Counts exclude image-specific locations; entries include theme/template and taxonomy URLs and are not a count of approved migration pages. Review them before deciding what to preserve.

| Sitemap                                              | Entries |
| ---------------------------------------------------- | ------- |
| https://ymsite.com/sitemap_index.xml                 | 10      |
| https://ymsisters.com/sitemap_index.xml              | 5       |
| https://youngmuslims.com/sitemap_index.xml           | 10      |
| https://ymsite.com/post-sitemap.xml                  | 6       |
| https://ymsite.com/page-sitemap.xml                  | 129     |
| https://ymsite.com/header-sitemap.xml                | 9       |
| https://ymsite.com/footer-sitemap.xml                | 6       |
| https://ymsite.com/osf_story-sitemap.xml             | 11      |
| https://ymsite.com/elemenfolio-sitemap.xml           | 17      |
| https://ymsite.com/category-sitemap.xml              | 2       |
| https://ymsite.com/osf_story_category-sitemap.xml    | 1       |
| https://ymsite.com/elemenfoliocategory-sitemap.xml   | 2       |
| https://ymsite.com/author-sitemap.xml                | 2       |
| https://ymsisters.com/page-sitemap.xml               | 26      |
| https://ymsisters.com/header-sitemap.xml             | 5       |
| https://ymsisters.com/footer-sitemap.xml             | 4       |
| https://ymsisters.com/osf_story-sitemap.xml          | 1       |
| https://ymsisters.com/osf_story_category-sitemap.xml | 1       |

The homepage at https://youngmuslims.com/ reached https://ymsite.com/ after two redirects. Its robots.txt and sitemap_index.xml reached HTTP ymsite.com endpoints after one redirect. These observations apply to the current forwarding, not the planned production configuration.

## Additional articles and resource landing pages

The following returned 200. Proposed disposition is to preserve or consolidate useful content deliberately; individual articles and files need their own equivalent destinations, not automatic redirects to /blog.

| URL                                                                                                      | Current title                                                                                       |
| -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| https://ymsite.com/resources/                                                                            | Resources \| Young Muslims Islamic Library                                                          |
| https://ymsite.com/about-young-muslims/annual-reports/                                                   | Annual Reports - YM Brothers                                                                        |
| https://ymsite.com/about-young-muslims/national-operations-cabinet/                                      | National Operations - Cabinet - YM Brothers                                                         |
| https://ymsite.com/muslim-american-society-mas-insights-on-allahs-laws-of-victory/                       | Muslim American Society (MAS): Insights on Allah’s Laws of Victory - YM Brothers                    |
| https://ymsite.com/launchgood-tips-on-ramadan-fundraising/                                               | LaunchGood Tips on Ramadan Fundraising - YM Brothers                                                |
| https://ymsite.com/yaqeen-institute-explains-what-shapes-muslim-identity/                                | Yaqeen Institute: Explains What Shapes Muslim Identity - YM Brothers                                |
| https://ymsite.com/how-to-give-a-khutbah/                                                                | How to Give a Khutbah \| About Young Muslims (YM)                                                   |
| https://ymsisters.com/resources/                                                                         | Resources - Young Muslims Sisters                                                                   |
| https://ymsite.com/blog-2/                                                                               | Blog - YM Brothers                                                                                  |
| https://ymsite.com/incredible-muslims-reflecting-on-muslim-crowdfunding-support-for-new-zealand-victims/ | Incredible Muslims: Reflecting on Muslim Crowdfunding Support for New Zealand Victims - YM Brothers |
| https://ymsite.com/empowering-society-through-holistic-education-insights-from-islamicity/               | Empowering Society Through Holistic Education: Insights from IslamiCity - YM Brothers               |
| https://ymsisters.com/resources-halaqah-toolkits/                                                        | Resources / Halqah Toolkits - Young Muslims Sisters                                                 |
| https://ymsisters.com/resources-annual-reports/                                                          | Resources / Annual Reports - Young Muslims Sisters                                                  |
| https://ymsisters.com/resources-myi-reports/                                                             | Resources / MYI Reports - Young Muslims Sisters                                                     |
| https://ymsite.com/judgement-stigma/                                                                     | Judgement Stigma - YM Brothers                                                                      |
| https://ymsite.com/launchgood-resources-helping-unlock-your-campaigns-potential/                         | LaunchGood Resources: Helping Unlock Your Campaign's Potential - YM Brothers                        |
| https://ymsite.com/blog-2/page/2/                                                                        | Blog - Page 2 of 2 - YM Brothers                                                                    |

## Discovered PDF downloads

HEAD confirms response status and MIME type only. Initial size-limit errors on larger files were resolved by retrying HEAD without a body-size restriction; these are not broken links.

| PDF URL                                                                                                | HEAD status | Linked from                                                                             |
| ------------------------------------------------------------------------------------------------------ | ----------- | --------------------------------------------------------------------------------------- |
| https://ymsite.com/wp-content/uploads/2024/10/MYI_-Addressing-Mental-Health-Full-Report.pdf            | 200         | https://ymsite.com/resources/                                                           |
| https://ymsite.com/wp-content/uploads/2024/10/Addressing-Pornography-YM-Muslim-Youth-Issues.pdf        | 200         | https://ymsite.com/resources/                                                           |
| https://ymsite.com/wp-content/uploads/2023/10/Judgment-Stigma-Report-PDF-YM-Muslim-Youth-Issues.pdf    | 200         | https://ymsite.com/resources/<br>https://ymsite.com/about-young-muslims/annual-reports/ |
| https://ymsite.com/wp-content/uploads/2023/10/Handbook-on-Systemic-Injustices.pdf                      | 200         | https://ymsite.com/resources/<br>https://ymsite.com/about-young-muslims/annual-reports/ |
| https://ymsite.com/wp-content/uploads/2023/10/YM-Ramadan-Guide-2020.pdf                                | 200         | https://ymsite.com/resources/<br>https://ymsite.com/about-young-muslims/annual-reports/ |
| https://ymsite.com/wp-content/uploads/2024/07/Through-the-Eyes-of-American-Muslims-Final-V4.pdf        | 200         | https://ymsite.com/resources/                                                           |
| https://ymsite.com/wp-content/uploads/2026/02/YM-Annual-Report-2025-FINAL-1.pdf                        | 200         | https://ymsite.com/about-young-muslims/annual-reports/                                  |
| https://ymsite.com/wp-content/uploads/2025/02/YM-Annual-Report-2024-Final.pdf                          | 200         | https://ymsite.com/about-young-muslims/annual-reports/                                  |
| https://ymsite.com/wp-content/uploads/2024/02/YM-Annual-Report-2023-STANDARD-1.pdf                     | 200         | https://ymsite.com/about-young-muslims/annual-reports/                                  |
| https://ymsite.com/wp-content/uploads/2024/06/Cabinet-Quarterly-Report-6-25-24.pdf                     | 200         | https://ymsite.com/about-young-muslims/national-operations-cabinet/                     |
| https://ymsite.com/wp-content/uploads/2024/11/Cabinet-Quarterly-Report-Q3.pdf                          | 200         | https://ymsite.com/about-young-muslims/national-operations-cabinet/                     |
| https://ymsite.com/wp-content/uploads/2025/01/Cabinet-Quarterly-Report-Q4-1.pdf                        | 200         | https://ymsite.com/about-young-muslims/national-operations-cabinet/                     |
| https://ymsite.com/wp-content/uploads/2022/02/2022-Annual-Calendar-Website-1.pdf                       | 404         | https://ymsite.com/our-programs/                                                        |
| https://ymsite.com/wp-content/uploads/2022/04/MYI_-Addressing-Mental-Health-Full-Report.pdf            | 404         | https://ymsisters.com/donate/<br>https://ymsite.com/ym-online-store/                    |
| https://ymsite.com/wp-content/uploads/2022/11/Judgment-Stigma-Report-YM-Muslim-Youth-Issues-v2.pdf     | 200         | https://ymsite.com/2020/11/<br>https://ymsite.com/category/latest-articles/             |
| https://ymsisters.com/wp-content/uploads/2024/02/Young-Muslims-Sisters-Q3-1.pdf                        | 200         | https://ymsisters.com/resources-halaqah-toolkits/                                       |
| https://ymsisters.com/wp-content/uploads/2024/10/Judgment-Stigma-Report-PDF-YM-Muslim-Youth-Issues.pdf | 200         | https://ymsisters.com/resources-myi-reports/                                            |
| https://ymsisters.com/wp-content/uploads/2024/10/MYI_-Addressing-Mental-Health-Full-Report.pdf         | 200         | https://ymsisters.com/resources-myi-reports/                                            |
| https://ymsisters.com/wp-content/uploads/2024/10/Addressing-Pornography-YM-Muslim-Youth-Issues.pdf     | 200         | https://ymsisters.com/resources-myi-reports/                                            |
| https://ymsite.com/wp-content/uploads/2021/11/Addressing-Pornography-YM-Muslim-Youth-Issues.pdf        | 404         | https://ymsite.com/ym-online-store/                                                     |

## Broken URLs and suggested review

| URL                                                                                             | Result     | Next action                                                                                  |
| ----------------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------- |
| https://ymsite.com/who-we-are-2/                                                                | 404 (GET)  | Compare with live /about-young-muslims/ before mapping.                                      |
| https://ymsite.com/wp-content/uploads/2022/02/2022-Annual-Calendar-Website-1.pdf                | 404 (HEAD) | Review historical value and available replacement; do not redirect to an unrelated homepage. |
| https://ymsite.com/young-muslims-leadership-conference-2021-waiver/                             | 404 (GET)  | Review historical value and available replacement; do not redirect to an unrelated homepage. |
| https://ymsite.com/wp-content/uploads/2022/04/MYI_-Addressing-Mental-Health-Full-Report.pdf     | 404 (HEAD) | Compare with the live 2024/10 mental-health PDF; verify content/version equivalence.         |
| https://ymsite.com/wp-content/uploads/2021/11/Addressing-Pornography-YM-Muslim-Youth-Issues.pdf | 404 (HEAD) | Compare with the live 2024/10 pornography report PDF; verify content/version equivalence.    |
| https://ymsite.com/giving-a-khutbah/                                                            | 404 (GET)  | Compare with live /how-to-give-a-khutbah/ before mapping.                                    |

## Externally hosted resources

These public links were discovered on the sisters' resource pages. Access and file contents were not verified. Some URLs may be variants of the same file. Preserve useful links or arrange owner-approved migration; do not treat them as local redirect rules.

| External link                                                                                | Discovered on                                                                                        |
| -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| https://drive.google.com/file/d/18yFJJQdfRPk4_Nr6ugP3DbQaIkCF_5KO/view                       | https://ymsisters.com/resources-halaqah-toolkits/                                                    |
| https://drive.google.com/file/d/1BV92gDUbJ6NgPgInDQMhHp8ri0Plv6Yq/view?usp=sharing           | https://ymsisters.com/resources-halaqah-toolkits/                                                    |
| https://drive.google.com/file/d/1GW1pRJXFnILbP2alw-FgW3_BLG1YV57T/view?usp=sharing           | https://ymsisters.com/resources-halaqah-toolkits/                                                    |
| https://drive.google.com/file/d/1myRG8Af2xLjlbRhckKrcs6fAq1DpW2x9/view?usp=sharing           | https://ymsisters.com/resources-halaqah-toolkits/<br>https://ymsisters.com/resources-annual-reports/ |
| https://drive.google.com/file/d/10Oyn7BsXQ-WjDdWkH_5Jv3k0lf6itRJz/view?usp=sharing           | https://ymsisters.com/resources-halaqah-toolkits/                                                    |
| https://drive.google.com/file/d/1EUrZN5hGKC835aPSShyBZqMBlxC0Addn/view?usp=sharing           | https://ymsisters.com/resources-halaqah-toolkits/                                                    |
| https://docs.google.com/document/d/1Rl3din9AFWKI38y2HR7DeTg27DxbYPKA51UgMTftxOM/edit?tab=t.0 | https://ymsisters.com/resources-halaqah-toolkits/                                                    |
| https://docs.google.com/document/d/1sASoINxh8-Q4-sTkqoyQjOk55obzULxk5van5fB15-Y/edit?tab=t.0 | https://ymsisters.com/resources-halaqah-toolkits/                                                    |
| https://docs.google.com/document/d/1sASoINxh8-Q4-sTkqoyQjOk55obzULxk5van5fB15-Y/edit         | https://ymsisters.com/resources-halaqah-toolkits/                                                    |
| https://docs.google.com/document/d/1a1UR1x4rtmnAnKKuwlBAjWJE7i-XyYFytR5MhqxtVlg/edit?tab=t.0 | https://ymsisters.com/resources-halaqah-toolkits/                                                    |
| https://drive.google.com/file/d/1XWoq-c92oU50tZCSKhoCerTn_JI5RNet/view?usp=sharing           | https://ymsisters.com/resources-annual-reports/                                                      |
| https://drive.google.com/file/d/1yf6DXASE12s4dDjkS-uG1SCUPJZa_-zp/view?usp=sharing           | https://ymsisters.com/resources-annual-reports/                                                      |
| https://drive.google.com/file/d/1J65bxUH0B8IrVQJ82X6NKf072ILQEGv-/view?usp=sharing           | https://ymsisters.com/resources-annual-reports/                                                      |

The brothers' resources page also links to https://linktr.ee/ympalestineresources (external resource collection, not crawled).

## Sitemap URL disposition backlog

All URLs discovered directly in sitemap XML are listed below. “Not fetched” means discovered but not verified, not broken. The inventory includes WordPress headers, footers, portfolios, campaigns, archives, and other historical content; a 200 response alone does not justify migration. Each useful page needs an approved destination under SEO-22.

| Discovered URL                                                                                           | Latest check |
| -------------------------------------------------------------------------------------------------------- | ------------ |
| https://ymsite.com/post-sitemap.xml                                                                      | 200          |
| https://ymsite.com/page-sitemap.xml                                                                      | 200          |
| https://ymsite.com/header-sitemap.xml                                                                    | 200          |
| https://ymsite.com/footer-sitemap.xml                                                                    | 200          |
| https://ymsite.com/osf_story-sitemap.xml                                                                 | 200          |
| https://ymsite.com/elemenfolio-sitemap.xml                                                               | 200          |
| https://ymsite.com/category-sitemap.xml                                                                  | 200          |
| https://ymsite.com/osf_story_category-sitemap.xml                                                        | 200          |
| https://ymsite.com/elemenfoliocategory-sitemap.xml                                                       | 200          |
| https://ymsite.com/author-sitemap.xml                                                                    | 200          |
| https://ymsisters.com/page-sitemap.xml                                                                   | 200          |
| https://ymsisters.com/header-sitemap.xml                                                                 | 200          |
| https://ymsisters.com/footer-sitemap.xml                                                                 | 200          |
| https://ymsisters.com/osf_story-sitemap.xml                                                              | 200          |
| https://ymsisters.com/osf_story_category-sitemap.xml                                                     | 200          |
| https://ymsite.com/judgement-stigma/                                                                     | 200          |
| https://ymsite.com/empowering-society-through-holistic-education-insights-from-islamicity/               | 200          |
| https://ymsite.com/incredible-muslims-reflecting-on-muslim-crowdfunding-support-for-new-zealand-victims/ | 200          |
| https://ymsite.com/yaqeen-institute-explains-what-shapes-muslim-identity/                                | 200          |
| https://ymsite.com/launchgood-tips-on-ramadan-fundraising/                                               | 200          |
| https://ymsite.com/muslim-american-society-mas-insights-on-allahs-laws-of-victory/                       | 200          |
| https://ymsite.com/                                                                                      | 200          |
| https://ymsite.com/domain-fundraiser/                                                                    | 200          |
| https://ymsite.com/basketball-league-registration/                                                       | 200          |
| https://ymsite.com/donate/                                                                               | 200          |
| https://ymsite.com/become-a-volunteer/                                                                   | 200          |
| https://ymsite.com/faq/                                                                                  | 200          |
| https://ymsite.com/gallery/                                                                              | 200          |
| https://ymsite.com/core-values/                                                                          | 200          |
| https://ymsite.com/our-team/                                                                             | 200          |
| https://ymsite.com/locations/                                                                            | 200          |
| https://ymsite.com/our-programs/events/                                                                  | 200          |
| https://ymsite.com/ym-online-store/                                                                      | 200          |
| https://ymsite.com/campaigns/                                                                            | 200          |
| https://ymsite.com/texas-retreat-donation/                                                               | 200          |
| https://ymsite.com/locksfall2023/                                                                        | 200          |
| https://ymsite.com/career/                                                                               | 200          |
| https://ymsite.com/endowment/                                                                            | 200          |
| https://ymsite.com/how-we-help/                                                                          | 200          |
| https://ymsite.com/home/                                                                                 | 200          |
| https://ymsite.com/our-programs/events-calendar/                                                         | 200          |
| https://ymsite.com/our-programs/                                                                         | 200          |
| https://ymsite.com/give-old/                                                                             | 200          |
| https://ymsite.com/how-to-give-a-khutbah/                                                                | 200          |
| https://ymsite.com/our-programs/neighbornets/                                                            | 200          |
| https://ymsite.com/our-programs/retreats-program/                                                        | 200          |
| https://ymsite.com/contact-us-2/                                                                         | 200          |
| https://ymsite.com/ym-cabinet-oath/                                                                      | 200          |
| https://ymsite.com/org-updates/                                                                          | 200          |
| https://ymsite.com/berlin-merch-s2k24/                                                                   | 200          |
| https://ymsite.com/zakat-foundation-of-america/                                                          | 200          |
| https://ymsite.com/our-programs/programs-conferences/                                                    | 200          |
| https://ymsite.com/ymc2024/                                                                              | 200          |
| https://ymsite.com/portal/                                                                               | 200          |
| https://ymsite.com/ymc-merch-order-form/                                                                 | 200          |
| https://ymsite.com/launchgood-resources-helping-unlock-your-campaigns-potential/                         | 200          |
| https://ymsite.com/islamicity-quran-reader-guiding-your-faith-journey/                                   | 200          |
| https://ymsite.com/ym-njxpa-retreat-2024/                                                                | 200          |
| https://ymsite.com/ym-midwest-retreat-2024/                                                              | 200          |
| https://ymsite.com/american-muslims-for-palestine-amp-educating-the-american-public-about-palestine/     | 200          |
| https://ymsite.com/american-muslims-for-palestine-guide-to-supporting-palestine/                         | 200          |
| https://ymsite.com/a-continuous-charity-breaking-the-chains-of-riba-for-muslim-students/                 | 200          |
| https://ymsite.com/icna-guide-on-getting-closer-to-allah-this-ramadan/                                   | 200          |
| https://ymsite.com/merchshop/                                                                            | 200          |
| https://ymsite.com/hcm-registration/                                                                     | 200          |
| https://ymsite.com/connecticut-initials/                                                                 | 200          |
| https://ymsite.com/ym-south-retreat-2024/                                                                | 200          |
| https://ymsite.com/ne2024/                                                                               | 200          |
| https://ymsite.com/ym-florida-games-sponsorship/                                                         | 200          |
| https://ymsite.com/ctmerch/                                                                              | 200          |
| https://ymsite.com/ymse2024/                                                                             | Not fetched  |
| https://ymsite.com/issue-reporting-form/                                                                 | 200          |
| https://ymsite.com/midwest-retreat-form/                                                                 | Not fetched  |
| https://ymsite.com/ctconference/                                                                         | Not fetched  |
| https://ymsite.com/ym-locations/connecticut-subregion/                                                   | Not fetched  |
| https://ymsite.com/sr-ski-trip-registration/                                                             | Not fetched  |
| https://ymsite.com/about-young-muslims/                                                                  | 200          |
| https://ymsite.com/about-young-muslims/national-operations-cabinet/                                      | 200          |
| https://ymsite.com/ym-ma-ri-merch/                                                                       | Not fetched  |
| https://ymsite.com/elementor-13339/                                                                      | Not fetched  |
| https://ymsite.com/ym-leaderboard-ranking/                                                               | Not fetched  |
| https://ymsite.com/fl-ioa-2025/                                                                          | Not fetched  |
| https://ymsite.com/ymlc-2024/                                                                            | Not fetched  |
| https://ymsite.com/ctymcbus/                                                                             | Not fetched  |
| https://ymsite.com/maineretreat25/                                                                       | Not fetched  |
| https://ymsite.com/about-young-muslims/project-postman/                                                  | Not fetched  |
| https://ymsite.com/ga-retreat/                                                                           | Not fetched  |
| https://ymsite.com/neretreat25/                                                                          | Not fetched  |
| https://ymsite.com/25ymcttr/                                                                             | Not fetched  |
| https://ymsite.com/ymlc-alumni-room-selection/                                                           | Not fetched  |
| https://ymsite.com/fl-games/                                                                             | Not fetched  |
| https://ymsite.com/grad-payment-form/                                                                    | Not fetched  |
| https://ymsite.com/ymct3llc/                                                                             | Not fetched  |
| https://ymsite.com/ym/                                                                                   | Not fetched  |
| https://ymsite.com/ymctllc-sponsorship/                                                                  | Not fetched  |
| https://ymsite.com/cabinet-recruitment-form/                                                             | 200          |
| https://ymsite.com/ymc-se-program/                                                                       | Not fetched  |
| https://ymsite.com/houston-ironman-tournament/                                                           | Not fetched  |
| https://ymsite.com/ymc-se/                                                                               | Not fetched  |
| https://ymsite.com/ym-locations/                                                                         | 200          |
| https://ymsite.com/new-england-ym-quarter-zips/                                                          | Not fetched  |
| https://ymsite.com/ymc-south/                                                                            | Not fetched  |
| https://ymsite.com/berlinmerch/                                                                          | Not fetched  |
| https://ymsite.com/ymne-tarbiyyah-workshop/                                                              | Not fetched  |
| https://ymsite.com/ym-dallas-end-of-year-lock-in/                                                        | Not fetched  |
| https://ymsite.com/myi-god-image-survey/                                                                 | Not fetched  |
| https://ymsite.com/about-young-muslims/annual-reports/                                                   | 200          |
| https://ymsite.com/ymc-view-prev-year-form/                                                              | Not fetched  |
| https://ymsite.com/ymc-2025/                                                                             | Not fetched  |
| https://ymsite.com/ymc-2026/                                                                             | Not fetched  |
| https://ymsite.com/ymc2026-reg/                                                                          | Not fetched  |
| https://ymsite.com/give/                                                                                 | 200          |
| https://ymsite.com/ym-pennsylvania-merch-form/                                                           | Not fetched  |
| https://ymsite.com/ymc-2026-register/                                                                    | Not fetched  |
| https://ymsite.com/conference/                                                                           | Not fetched  |
| https://ymsite.com/ymlc-2026-alumni-room-selection/                                                      | Not fetched  |
| https://ymsite.com/ymlc-2026-financial-aid-form/                                                         | Not fetched  |
| https://ymsite.com/nyw-spring-soccer/                                                                    | Not fetched  |
| https://ymsite.com/young-muslims-westchester-soccer-tournament/                                          | Not fetched  |
| https://ymsite.com/ymc-sharon-registration-26/                                                           | Not fetched  |
| https://ymsite.com/ymc-2026-florida-transportation/                                                      | Not fetched  |
| https://ymsite.com/conference-schedule/                                                                  | Not fetched  |
| https://ymsite.com/postman/                                                                              | Not fetched  |
| https://ymsite.com/ym-south-summit-2026/                                                                 | Not fetched  |
| https://ymsite.com/ym-houston-basketball-league-2026/                                                    | Not fetched  |
| https://ymsite.com/ga-retreat-26/                                                                        | Not fetched  |
| https://ymsite.com/ymlc-2026-payment-form/                                                               | Not fetched  |
| https://ymsite.com/elementor-15208/                                                                      | Not fetched  |
| https://ymsite.com/resources/                                                                            | 200          |
| https://ymsite.com/2026-ym-retreat-niles-icws-plainfield/                                                | Not fetched  |
| https://ymsite.com/conn-lake-compounce-trip-2026/                                                        | Not fetched  |
| https://ymsite.com/se-rlc/                                                                               | Not fetched  |
| https://ymsite.com/hk-test/                                                                              | Not fetched  |
| https://ymsite.com/ym-nye-six-flags/                                                                     | Not fetched  |
| https://ymsite.com/young-muslims-inc-sms-text-message-privacy-policy/                                    | Not fetched  |
| https://ymsite.com/ym-houston-beach-day-2026/                                                            | Not fetched  |
| https://ymsite.com/private-policy/                                                                       | Not fetched  |
| https://ymsite.com/sms-mms-private-policy/                                                               | Not fetched  |
| https://ymsite.com/terms-of-service/                                                                     | Not fetched  |
| https://ymsite.com/test/                                                                                 | Not fetched  |
| https://ymsite.com/young-muslims-ym-tri-state-retreat-form-2026/                                         | Not fetched  |
| https://ymsite.com/pad-2026/                                                                             | Not fetched  |
| https://ymsite.com/ym-ne-retreat-reg-2026/                                                               | Not fetched  |
| https://ymsite.com/ym-sms-mms-onboarding-form/                                                           | Not fetched  |
| https://ymsite.com/ym-south-retreat-form-2026/                                                           | Not fetched  |
| https://ymsite.com/fl-retreat/                                                                           | Not fetched  |
| https://ymsite.com/llc4/                                                                                 | Not fetched  |
| https://ymsite.com/ym-on-skates/                                                                         | Not fetched  |
| https://ymsite.com/ym-houston-ironman-tournament-2026/                                                   | Not fetched  |
| https://ymsite.com/nye_merch/                                                                            | Not fetched  |
| https://ymsite.com/header/                                                                               | Not fetched  |
| https://ymsite.com/header/header-landing/                                                                | Not fetched  |
| https://ymsite.com/header/header-black-white/                                                            | Not fetched  |
| https://ymsite.com/header/header-shop/                                                                   | Not fetched  |
| https://ymsite.com/header/header-black/                                                                  | Not fetched  |
| https://ymsite.com/header/header-white/                                                                  | Not fetched  |
| https://ymsite.com/header/header-neighbornets/                                                           | Not fetched  |
| https://ymsite.com/header/header-ym-joint-page-header/                                                   | Not fetched  |
| https://ymsite.com/header/postman-page-header/                                                           | Not fetched  |
| https://ymsite.com/footer/                                                                               | Not fetched  |
| https://ymsite.com/footer/footer-landing/                                                                | Not fetched  |
| https://ymsite.com/footer/footer-02/                                                                     | Not fetched  |
| https://ymsite.com/footer/footer-shop/                                                                   | Not fetched  |
| https://ymsite.com/footer/footer-01/                                                                     | Not fetched  |
| https://ymsite.com/footer/ym-joint-page-footer/                                                          | Not fetched  |
| https://ymsite.com/story/                                                                                | Not fetched  |
| https://ymsite.com/story/an-inside-look-at-a-viral-instagram-campaign/                                   | Not fetched  |
| https://ymsite.com/story/an-inside-look-at-a-viral-instagram-campaign-for-migrants-in-tijuana/           | Not fetched  |
| https://ymsite.com/story/meet-6-organizations-ensuring-girls-reach-their-full-brilliant-potential/       | Not fetched  |
| https://ymsite.com/story/why-a-girls-club-in-ghana-changed-its-membership-policy/                        | Not fetched  |
| https://ymsite.com/story/how-one-company-shows-employees-it-cares-about-them-and-the-world/              | Not fetched  |
| https://ymsite.com/story/these-5-climate-activists-are-committed-to-conservation/                        | Not fetched  |
| https://ymsite.com/story/how-crowdfunding-benefits-nonprofits-and-donors/                                | Not fetched  |
| https://ymsite.com/story/how-a-nonprofit-in-tanzania-raised-44000-in-its-year-end-campaign/              | Not fetched  |
| https://ymsite.com/story/police-department-recognition-award/                                            | Not fetched  |
| https://ymsite.com/story/neighbornet/                                                                    | Not fetched  |
| https://ymsite.com/portfolio/cabinet-teams-2/                                                            | Not fetched  |
| https://ymsite.com/portfolio/cloud-teams/                                                                | Not fetched  |
| https://ymsite.com/portfolio/regional-teams/                                                             | Not fetched  |
| https://ymsite.com/portfolio/embracing-our-muslim-identity-in-our-careers-lives/                         | Not fetched  |
| https://ymsite.com/portfolio/pieces-of-advice/                                                           | Not fetched  |
| https://ymsite.com/portfolio/serving-the-community/                                                      | Not fetched  |
| https://ymsite.com/portfolio/skill-team-development/                                                     | Not fetched  |
| https://ymsite.com/portfolio/personal-development/                                                       | Not fetched  |
| https://ymsite.com/portfolio/working-with-and-reaching-out-to-the-youth-the-neighbornet/                 | Not fetched  |
| https://ymsite.com/portfolio/islamic-movement-and-our-history/                                           | Not fetched  |
| https://ymsite.com/portfolio/leadership-principles/                                                      | Not fetched  |
| https://ymsite.com/portfolio/dawah/                                                                      | Not fetched  |
| https://ymsite.com/portfolio/standing-on-shoulders-of-giants/                                            | Not fetched  |
| https://ymsite.com/portfolio/standing-on-shoulders-of-giants-2/                                          | Not fetched  |
| https://ymsite.com/portfolio/standing-on-shoulders-of-giants-3/                                          | Not fetched  |
| https://ymsite.com/portfolio/standing-on-shoulders-of-giants-4/                                          | Not fetched  |
| https://ymsite.com/portfolio/standing-on-shoulders-of-giants-5/                                          | Not fetched  |
| https://ymsite.com/category/latest-articles/                                                             | 200          |
| https://ymsite.com/category/uncategorized/                                                               | 200          |
| https://ymsite.com/category-story/stories/                                                               | Not fetched  |
| https://ymsite.com/portfoliocategory/document-resources/                                                 | Not fetched  |
| https://ymsite.com/portfoliocategory/video-resources/                                                    | Not fetched  |
| https://ymsite.com/author/muneeb/                                                                        | 200          |
| https://ymsite.com/author/omarazad/                                                                      | Not fetched  |
| https://ymsisters.com/                                                                                   | 200          |
| https://ymsisters.com/become-a-volunteer/                                                                | Not fetched  |
| https://ymsisters.com/gallery/                                                                           | Not fetched  |
| https://ymsisters.com/campaigns-grid/                                                                    | Not fetched  |
| https://ymsisters.com/career/                                                                            | Not fetched  |
| https://ymsisters.com/core-values/                                                                       | Not fetched  |
| https://ymsisters.com/how-we-help/                                                                       | Not fetched  |
| https://ymsisters.com/inspring-stories/                                                                  | Not fetched  |
| https://ymsisters.com/donation-confirmation/                                                             | 200          |
| https://ymsisters.com/who-we-are/                                                                        | Not fetched  |
| https://ymsisters.com/faq/                                                                               | 200          |
| https://ymsisters.com/ym-brothers/                                                                       | Not fetched  |
| https://ymsisters.com/who-we-are-2/                                                                      | 200          |
| https://ymsisters.com/for-parents/                                                                       | 200          |
| https://ymsisters.com/resources-myi-reports/                                                             | 200          |
| https://ymsisters.com/our-programs/                                                                      | 200          |
| https://ymsisters.com/contact-us/                                                                        | 200          |
| https://ymsisters.com/locations/                                                                         | 200          |
| https://ymsisters.com/leadership/                                                                        | 200          |
| https://ymsisters.com/start-a-new-neighbornet/                                                           | 200          |
| https://ymsisters.com/resources/                                                                         | 200          |
| https://ymsisters.com/resources-halaqah-toolkits/                                                        | 200          |
| https://ymsisters.com/resources-annual-reports/                                                          | 200          |
| https://ymsisters.com/donate/                                                                            | 200          |
| https://ymsisters.com/ym-conference/                                                                     | Not fetched  |
| https://ymsisters.com/nearest-ym/                                                                        | Not fetched  |
| https://ymsisters.com/header/                                                                            | Not fetched  |
| https://ymsisters.com/header/header-landing/                                                             | Not fetched  |
| https://ymsisters.com/header/header-black/                                                               | Not fetched  |
| https://ymsisters.com/header/header-black-white/                                                         | Not fetched  |
| https://ymsisters.com/header/header-white/                                                               | Not fetched  |
| https://ymsisters.com/footer/                                                                            | Not fetched  |
| https://ymsisters.com/footer/footer-landing/                                                             | Not fetched  |
| https://ymsisters.com/footer/footer-02/                                                                  | Not fetched  |
| https://ymsisters.com/footer/footer-01/                                                                  | Not fetched  |
| https://ymsisters.com/story/                                                                             | Not fetched  |
| https://ymsisters.com/category-story/stories/                                                            | Not fetched  |

## What remains

- Compare this public inventory with a CMS export and Search Console top pages/backlinks to catch orphaned or unlisted content.
- Review the not-fetched sitemap URLs and identify genuine content versus theme/demo or obsolete transactional pages.
- Assign destinations for retained articles and PDFs; verify content equivalence for consolidated About and program pages.
- Validate browser rendering and actual donation flows separately; this audit performed read-only requests only.
- Search-performance and backlink exports remain outstanding. Public links found here are outbound-link discoveries, not a backlink export.
