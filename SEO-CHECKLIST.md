# SEO implementation and launch tracker

Baseline inspected: 2026-10-02. This is the source of truth for SEO tasks,
dependencies, and verification. It records planned work, not completed
implementation or a guarantee of search rankings.

Implementation update: production indexing controls, per-page canonicals, and
robots/sitemap routes are now implemented for all eight pages. Production is
opted in through `netlify.toml`; previews remain non-indexable. SEO-12/13/14 still
require applicable deployed-host checks before full sign-off. Baseline observations
below describe the earlier state, not the updated code. The owner's request to
implement indexing authorizes the production opt-in for the next deployment.

Local validation: lint and type checking passed. Production and preview Webpack
builds passed `scripts/check-indexing.mjs` for all eight generated pages,
canonicals, sitemap, robots, and header configuration. The preview test deliberately
set `SITE_INDEXABLE=true` to verify context isolation. The default Turbopack build
hit an environment port restriction; Webpack was used for verification without
changing the project's default build command. Actual deployed HTTP responses and
alternate-host behavior remain pending under STAGE/POST checks.

## How to track work

- Leave a task unchecked until its acceptance criteria have been verified.
- Task IDs are stable. `Depends on` refers to another task ID in this document.
- `Launch` means required before enabling public indexing. `Growth` means it can
  follow launch unless needed to preserve existing content during migration.
- Role labels are suggested ownership, not assigned people. Record actual owners
  and dates in the work log below.
- Keep production indexing disabled while content is unfinished. A Netlify
  production-context deployment can still be a prototype.
- Run local checks before any deployment, preview checks before public launch,
  and production checks immediately after launch. Preview deployment is not the
  same as enabling public indexing.

## Existing foundations and verification scope

The site owner reports that indexing controls have progressed beyond the
wireframe stage. Treat SEO-13 as verification of those existing controls, not
an instruction to rebuild them. The local `ongoing-build` checkout still shows
unconditional root `noindex`; this observation does not establish the state of
another branch or the deployed hosting configuration. Reconcile the intended
release commit and hosting settings before changing indexing behavior.

Observed in this checkout, not against deployed hosting settings:

- Next.js App Router pages have metadata exports and a shared title template.
- The local root layout applies `noindex, nofollow` unconditionally; verify it
  against the current indexing implementation and intended release.
- `/design-system` has its own non-indexing metadata in this checkout. The site
  owner now requests indexing all current pages, including this one; reconcile
  that override under SEO-13.
- Netlify preview and branch contexts exist; this local configuration file does
  not declare indexing environment variables. Hosting-managed variables have
  not been inspected.
- Canonicals, sitemap, robots route, and SEO structured data are not implemented.
- No individual chapter, article, or event detail routes exist yet.
- Some page content and media are still prototype scaffolding.
- The documented production domain is `youngmuslims.com`; the two legacy sites
  are intended to consolidate into it.

## 1. Decisions, access, and baseline

Current inventory: [SEO-ROUTE-INVENTORY.md](SEO-ROUTE-INVENTORY.md). All eight
current pages are approved for production indexing, including `/design-system`.
No current pages are excluded or deferred. This records intended indexability;
it does not assert that live indexing has been enabled or verified.

- [ ] **SEO-01 | Launch | Site owner:** Confirm canonical origin as
      `https://youngmuslims.com`, supported audiences/geography, and first-release
      page inventory. Record which pages will be public, excluded, or deferred.
      **Depends on:** none. **Done when:** the approved inventory includes each URL,
      intended search purpose, content owner, and indexability.
      **Progress:** routes and indexing decision recorded; search purposes drafted.
      Audience/geography and content-owner assignments remain outstanding.
- [ ] **SEO-02 | Launch | Site owner / hosting:** Confirm access to Netlify,
      DNS, legacy hosts, domain renewals, and Search Console/Bing properties.
      Verify search-tool ownership through DNS where possible before launch; a live
      new website is not required for DNS ownership verification.
      **Depends on:** SEO-01. **Done when:** responsible people can manage all three
      domains and retain HTTPS/redirect service for the old domains.
- [ ] **SEO-03 | Launch | SEO / content:** Inventory existing URLs on all affected
      domains, including articles, PDFs, images with inbound links, and donation or
      campaign landing pages. Export available search queries, clicks, impressions,
      top landing pages, and backlinks before migration. Record unavailable data.
      **Depends on:** SEO-02. **Done when:** the URL inventory and dated baseline are
      saved with links in the work log.
      **Progress:** [14 owner-supplied legacy URLs](SEO-LEGACY-URL-INVENTORY.md)
      recorded with intended new destinations. [Public audit](SEO-LEGACY-AUDIT.md)
      verified all 14, checked 138 URLs, and recorded additional articles and 20
      PDF URLs. Sitemap discoveries are inventoried; CMS/orphan-page checks,
      unvisited sitemap entries, and dated search-performance exports remain
      outstanding. Donation confirmation
      and campaign URLs require integration review before redirect implementation.
- [ ] **SEO-04 | Launch | Content / SEO:** Assign a primary search intent to each
      launch page. Prioritize branded searches, Muslim youth organization searches,
      and relevant local searches; validate assumptions using existing search data.
      Avoid multiple pages competing with identical copy for the same intent.
      **Depends on:** SEO-01, SEO-03. **Done when:** a keyword-to-page map is approved.

## 2. Content and information architecture

- [ ] **SEO-05 | Launch | Content:** Replace placeholder copy, invented authors,
      dates, stories, statistics, and media on every indexable page. State clearly
      what Young Muslims does, who it serves, where it operates, and how to join.
      Explain “NeighborNet” in familiar language. Substantiate organizational claims.
      **Depends on:** SEO-04. **Done when:** content owners approve each launch page
      and no scaffolding appears in its rendered content or serialized payload.
- [ ] **SEO-06 | Launch | Content / design:** Provide descriptive page titles,
      useful descriptions, a clear main heading, logical subheadings, meaningful link
      text, and image alt text. Keep decorative images' alt text empty. Check the
      homepage does not repeat the brand through the title template.
      **Depends on:** SEO-05. **Done when:** every launch URL has a reviewed metadata
      and heading entry; copy is natural and avoids keyword stuffing.
- [ ] **SEO-07 | Launch | Development:** Provide a crawlable chapter directory
      alongside the interactive map. Important location information must be available
      as HTML text and links without requiring a map click, geolocation, or search.
      Verify chapter names, city/state labels, and contact destinations with owners.
      **Depends on:** SEO-01, SEO-05. **Done when:** users and crawlers can discover
      the published locations through ordinary links and readable text.
- [ ] **SEO-08 | Growth | Content / development:** Add permanent chapter URLs
      with useful, verified local content: activities, audience, general location,
      joining instructions, contact method, and last-verified date. Publish public
      schedules and photos only when approved. Do not turn approximate map coordinates
      into claimed street addresses or generate thin city-swapped pages.
      **Depends on:** SEO-07, SEO-12, SEO-14. **Done when:** each published chapter
      page has substantive local information, directory links, and a content owner.
- [ ] **SEO-09 | Launch for migrated content; Growth for new content | Content / development:**
      Build individual article, resource, story, and event routes as needed by the
      migration inventory. Keep valuable existing content accessible at an equivalent
      URL. Use real authors, dates, sources, and reviewer credentials where relevant.
      Add useful program pages when sufficient content exists.
      **Depends on:** SEO-03, SEO-04, SEO-12. **Done when:** every retained legacy
      resource has a working destination; new content has permanent, linked URLs.
- [ ] **SEO-10 | Launch | Content / site owner:** Publish accurate organization
      identity, mission, history, contact information, and relevant leadership or
      impact information. Confirm legal/nonprofit descriptions before using them in
      copy or structured data. Obtain approval for participant stories and images.
      **Depends on:** SEO-05. **Done when:** the About and Support pages establish
      a verifiable identity and explain participation and support clearly.
- [ ] **SEO-11 | Launch | Content / development:** Link every indexable page
      from another discoverable page. Add relevant links between resources, programs,
      chapters, and joining/support actions. Use actual anchors with `href` values;
      give substantial content its own URL instead of only a modal or fragment.
      **Depends on:** SEO-07, SEO-09. **Done when:** a crawl finds no orphan launch pages.

## 3. Technical implementation

Before modifying `src/`, read [WIREFRAME.md](WIREFRAME.md). Before using Next.js
APIs, read the relevant installed documentation under `node_modules/next/dist/docs/`.

- [ ] **SEO-12 | Launch | Development:** Create a shared canonical-origin and
      metadata convention. Add `metadataBase` and per-page canonical URLs using the
      approved origin. Do not give every page the homepage canonical. Define handling
      for trailing slashes, campaign parameters, and map/filter URLs.
      **Depends on:** SEO-01. **Done when:** each unique indexable page declares its
      own correct canonical and no canonical contains localhost or a preview host.
- [ ] **SEO-13 | Launch | Development / hosting:** Verify the existing indexing
      controls against the intended release commit and hosting configuration. Retain
      working controls and address only confirmed gaps. Require an explicit launch opt-in such as
      `SITE_INDEXABLE=true` for the production context; keep local, branch, and preview
      builds non-indexable even if a shared setting is accidentally inherited.
      Do not rely on `NODE_ENV`, since previews also use production builds. Keep the
      opt-in false until launch approval. Make all eight current pages eligible
      on production, including reconciling `/design-system`'s explicit exclusion.
      Check child metadata cannot accidentally permit preview
      indexing. Assess an `X-Robots-Tag` header for HTML and public non-HTML assets;
      confirm actual CDN behavior rather than assuming app headers cover every file.
      **Depends on:** SEO-01. **Done when:** all cases in the indexing matrix pass.
- [ ] **SEO-14 | Launch | Development:** Add `robots.txt` and a sitemap generated
      from the published page inventory. Include only canonical, indexable URLs that
      return `200`. Include all eight current pages, including `/design-system`.
      Exclude drafts, previews, redirects, and
      filter variants. Use accurate content modification dates if supplied, not the
      current build date for unchanged pages. Advertise the sitemap on production.
      Allow crawlers to retrieve public preview pages so they can see `noindex`;
      `Disallow: /` is not a substitute for non-indexing. Use authentication when
      preview content must be private.
      **Depends on:** SEO-12, SEO-13. **Done when:** generated files match the inventory
      and there are no conflicting versions in `public/` and `src/app/`.
- [ ] **SEO-15 | Launch | Development / content:** Add truthful `Organization`
      (or applicable subtype) and `WebSite` JSON-LD on the appropriate pages. Use
      verified names, logo URLs, canonical origin, and official social profiles.
      **Depends on:** SEO-10, SEO-12. **Done when:** markup is valid, agrees with visible
      content, and all referenced URLs resolve. Rich-result display is not guaranteed.
- [ ] **SEO-16 | Growth, or Launch when corresponding content ships | Development:**
      Add `Article`, `BreadcrumbList`, and eligible `Event` markup to matching detail
      pages. Do not mark a generic program description as a dated event. Keep event
      status and dates current; do not add unsupported claims or invented reviews.
      **Depends on:** SEO-09, SEO-15. **Done when:** applicable validation passes and
      structured data reflects the page's visible content.
- [ ] **SEO-17 | Launch | Design / development:** Add favicons and default social
      preview metadata/images, with page-specific images where useful. Ensure absolute
      image URLs resolve and previews use approved copy. These improve presentation
      and sharing; they do not guarantee higher rankings.
      **Depends on:** SEO-06, SEO-12. **Done when:** image dimensions, URLs, and previews
      are verified for representative pages.
- [ ] **SEO-18 | Launch | Development:** Keep essential content and links in the
      rendered HTML. Optimize hero video/poster, images, fonts, animations, map loading,
      and donation/analytics scripts. Reserve media dimensions and avoid delaying
      primary content behind interaction or consent UI. Test mobile layout, keyboard
      navigation, readable text, and usable joining/donation actions.
      **Depends on:** SEO-05, SEO-07. **Done when:** representative mobile tests show
      no material content, interaction, or layout failures; record lab measurements.
- [ ] **SEO-19 | Launch | Development:** Return real `404`/`410` responses for
      missing/retired URLs without replacements. Ensure published content returns
      `200`, redirects return `301`/`308`, and missing pages do not masquerade as `200`.
      **Depends on:** SEO-09, SEO-22. **Done when:** the status-code test set passes.
- [ ] **SEO-20 | Launch | Development:** Add focused automated checks for accidental
      production `noindex`, indexable previews, canonical mistakes, sitemap exclusions,
      broken internal links, and redirect mappings. Test actual rendered output and
      responses, not only the configuration values that generate them.
      **Depends on:** SEO-12 through SEO-19, SEO-22. **Done when:** checks run repeatably
      and deliberate regressions cause meaningful failures.
- [ ] **SEO-21 | Growth | Development / content:** Put required metadata, stable
      slugs, authorship, alt text, publication status, and update ownership into CMS
      models/templates. Ensure publishing updates pages and sitemap caches. Document
      the per-page checklist in repository guidance. Optionally create a project SEO
      skill using these tested conventions.
      **Depends on:** CMS selection, SEO-06, SEO-14, SEO-20. **Done when:** a newly
      published test page satisfies the checklist and can be updated reliably.

## 4. Hosting, migration, and measurement

- [ ] **SEO-22 | Launch | SEO / development:** Map each legacy URL to a relevant
      replacement, retained URL, or intentional `404`/`410`. Include PDFs, campaign URLs,
      and existing store destinations. Identify collisions between legacy sites.
      Implement and test permanent HTTP redirects, avoiding chains and blanket
      redirects to an unrelated homepage. DNS alone does not issue HTTP redirects.
      **Depends on:** SEO-03, SEO-09, SEO-12. **Done when:** every inventoried legacy URL
      has an approved disposition and testable result.
- [ ] **SEO-23 | Launch | Hosting:** Configure valid HTTPS, canonical host redirects,
      and handling for HTTP, `www`, legacy hosts, the default Netlify hostname, and
      deploy-specific aliases. Production build artifacts may be accessible on multiple
      hosts, so build-time environment checks alone do not distinguish those hosts.
      Define redirect, access-control, or non-indexing behavior for each alternate host.
      Keep old domains and TLS certificates active for redirects for at least a year,
      preferably indefinitely. Confirm rollback and ownership before cutover.
      **Depends on:** SEO-02, SEO-13, SEO-22. **Done when:** a host/URL test matrix is
      documented and ready to verify against actual deployed responses.
- [ ] **SEO-24 | Launch | Analytics / site owner:** Configure Search Console and
      Bing ownership, appropriate analytics, and useful conversion events such as
      chapter inquiries, registrations, and completed donations. Exclude preview/test
      activity and personal form data from analytics; confirm applicable consent needs.
      Do not fire completed-donation events merely because a donation button was clicked.
      **Depends on:** SEO-02, forms/donation integration. **Done when:** ownership is
      verified and test events reflect the actual user actions without duplication.

## 5. Pre-deployment tests: local build

Use clean, separate builds for each indexing mode and stop the previous local
server before testing the next build. Environment changes require rebuilding
prerendered pages. Do not promote an indexable production artifact into a preview.

| Build/context                                  | Launch opt-in                        | Expected public page behavior  |
| ---------------------------------------------- | ------------------------------------ | ------------------------------ |
| Local development or local default build       | Missing                              | `noindex`                      |
| Production-context build before launch         | False                                | `noindex`                      |
| Production-context build after launch approval | True                                 | Indexable                      |
| Deploy preview                                 | False or accidentally inherited true | `noindex`                      |
| Branch deploy                                  | False or accidentally inherited true | `noindex`                      |
| Production `/design-system`                    | True                                 | Indexable, included in sitemap |

The implementation must define a reproducible local simulation of production
context for testing. Do not set global production environment values to test it.

- [ ] **PRE-01 | Development:** Run `bun run lint`, `bun run typecheck`,
      `bun run format:check`, and `bun run build`; record results and any pre-existing
      failures. **Depends on:** launch implementation tasks.
- [ ] **PRE-02 | Development:** Test every indexing-matrix case against built
      responses, including root, nested detail page, and excluded page. Inspect both
      robots/googlebot metadata and `X-Robots-Tag`; a permissive meta tag cannot cancel
      a blocking header. **Depends on:** SEO-13, SEO-20.
- [ ] **PRE-03 | Development / SEO:** Crawl all launch URLs. Confirm `200` for
      published pages, unique meaningful titles, correct canonicals, accessible body
      content and links, and no missing internal assets or orphan pages.
      **Depends on:** SEO-06, SEO-11, SEO-12, SEO-19.
- [ ] **PRE-04 | Development:** Parse the sitemap; compare its URLs to the approved
      inventory. Confirm exclusions, canonical hosts, response codes, and meaningful
      modification dates. Confirm robots rules allow intended pages and resources.
      **Depends on:** SEO-14.
- [ ] **PRE-05 | Development / content:** Validate JSON-LD using Schema.org
      validation and Google's Rich Results Test where a supported feature applies.
      Use code input when the site is not publicly accessible. Inspect social metadata
      and verify title-template behavior. **Depends on:** SEO-15, SEO-16, SEO-17.
- [ ] **PRE-06 | Development / design:** Test mobile content, keyboard access,
      image sizes, media loading, and layout shifts on representative pages. Run
      Lighthouse on the production build; record the device/network configuration.
      Lab results are a diagnostic baseline, not proof of real-user Core Web Vitals.
      **Depends on:** SEO-18.
- [ ] **PRE-07 | Development / SEO:** Run redirect and status tests for the full
      legacy mapping where possible, plus unknown paths and query-string variants.
      Review untestable host rules for preview/production verification.
      **Depends on:** SEO-19, SEO-22.

## 6. Preview deployment tests: before public launch

- [ ] **STAGE-01 | Hosting / development:** Deploy the release candidate with
      indexing disabled. Inspect GET responses and headers on preview, branch, and
      alternate deployment URLs. Confirm no child page overrides the intended
      restriction. **Depends on:** PRE-01 through PRE-07, SEO-23.
- [ ] **STAGE-02 | Development:** Repeat the crawl, metadata, status, and asset
      checks on Netlify. Test map, media, and donation/form integrations under deployed
      caching and security headers. Check HTTP headers on a representative public PDF
      if one ships; Next.js header configuration may not govern every CDN response.
      **Depends on:** STAGE-01.
- [ ] **STAGE-03 | Content / site owner:** Approve launch content, organization
      details, legacy replacements, and joining/support journeys. Remove or exclude
      incomplete pages. Confirm production notes and feedback tooling are disabled.
      **Depends on:** STAGE-02, SEO-05, SEO-10.
- [ ] **STAGE-04 | Hosting / site owner:** Approve cutover, named launch owner,
      rollback target, canonical host configuration, redirect mapping, and the exact
      production indexing opt-in. Ensure rollback will not restore a wireframe or
      site-wide `noindex` unnoticed. **Depends on:** STAGE-03, SEO-23, SEO-24.

Do not enable production indexing until all applicable Launch tasks, PRE checks,
and STAGE checks pass. Growth tasks only block launch when they preserve existing
content or support a feature included in the release.

## 7. Post-deployment tests: launch day

- [ ] **POST-01 | Hosting / development:** Deploy the approved production build,
      enable the production indexing opt-in, and activate redirects. Verify actual
      HTTPS GET responses for the homepage, every launch route, and excluded routes.
      Confirm intended pages have no blocking meta tags or headers, previews remain
      non-indexable, and alternate hosts behave as specified.
      **Depends on:** STAGE-04.
- [ ] **POST-02 | SEO / development:** Crawl production and every legacy mapping.
      Verify final canonical destinations, status codes, robots, sitemap, image URLs,
      and no loops or chains. Test both HTTP and HTTPS and `www`/apex variants.
      **Depends on:** POST-01.
- [ ] **POST-03 | SEO / site owner:** Submit the production sitemap in Search
      Console and Bing. Use Search Console URL Inspection on representative URLs to
      inspect rendered content and crawl eligibility. Submit applicable Change of
      Address requests for legacy domain moves. Record submission outcomes;
      submission or a live test does not mean a page has been indexed.
      **Depends on:** POST-02, SEO-24.
- [ ] **POST-04 | Analytics / development:** Validate production conversion
      tracking, social previews, schema tests, mobile performance, and critical user
      actions. Use safe test transactions/forms according to the integrations' setup.
      **Depends on:** POST-01, SEO-24.
- [ ] **POST-05 | Site owner / communications:** Update official social profiles,
      owned links, campaigns, and priority partner links to the final URLs. Preserve
      separate store or other services if they are outside the migration scope.
      **Depends on:** POST-02.

If critical production checks fail, pause sitemap submission and external launch
promotion, assign the failure, and repair or roll back using the approved plan.
Avoid casually applying site-wide `noindex` to an otherwise functioning live site
as a troubleshooting step. Re-run affected checks after the repair.

## 8. Post-deployment monitoring and growth

- [ ] **MON-01 | First 48 hours | Hosting / development:** Check uptime, HTTPS,
      server errors, redirect failures, missing assets, accidental indexing controls,
      and conversion failures. **Depends on:** POST-01 through POST-04.
- [ ] **MON-02 | Weekly for first month | SEO:** Review indexing reports, selected
      canonicals, sitemap processing, legacy URL transitions, and unexpected preview
      URLs in search. Investigate patterns rather than expecting every URL to index
      immediately. **Depends on:** POST-03.
- [ ] **MON-03 | Around days 28 and 60 | SEO / development:** Review available
      field performance in Search Console/PageSpeed Insights or real-user monitoring.
      Target LCP <= 2.5 seconds, INP <= 200 ms, and CLS <= 0.1 at the 75th percentile.
      Record “insufficient data” when traffic is too low; never infer a pass from it.
      **Depends on:** POST-04 and sufficient field data.
- [ ] **MON-04 | Monthly | SEO / content:** Compare against SEO-03 by branded vs.
      non-branded queries, city searches, landing pages, impressions, clicks, click-through
      rate, and conversions. Use position as a diagnostic, not the sole success metric.
      Assign content/internal-link improvements from the findings.
      **Depends on:** SEO-03, POST-03, POST-04.
- [ ] **MON-05 | Ongoing | Content / partnerships:** Publish useful original
      resources, approved stories, program information, and verified chapter pages.
      Earn relevant links from partner mosques, community organizations, and campuses.
      Avoid paid link schemes and mass-generated pages. Maintain local listings only
      where the organization/location qualifies. **Depends on:** SEO-08, SEO-09, SEO-21.
- [ ] **MON-06 | Quarterly and after major releases | Content / development:**
      Verify chapter contacts and schedules, expired events, broken links, metadata,
      redirects, and structured data. Repeat relevant PRE/STAGE/POST checks after route,
      CMS, domain, or hosting changes. Track old-domain renewal and redirect continuity.
      **Depends on:** POST-02.

## Work log and unresolved decisions

Add rows for work as it starts. Link test evidence to a build/commit and deployed
URL where applicable. A task checkbox records verified completion; this table
records ownership, progress, and reasons work is blocked or deferred.

| Task ID | Owner      | Status               | Target date | Evidence / result / blocker                                                                                                                         |
| ------- | ---------- | -------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| SEO-01  | Unassigned | In progress          | TBD         | [Eight routes inventoried](SEO-ROUTE-INVENTORY.md); all approved for production indexing. Audience/geography and content owners remain unconfirmed. |
| SEO-02  | Unassigned | Not started          | TBD         | Confirm domain, hosting, and search-tool access.                                                                                                    |
| SEO-03  | Unassigned | In progress          | TBD         | [14 supplied URLs mapped](SEO-LEGACY-URL-INVENTORY.md). Completeness checks, live verification, and search baseline remain outstanding.             |
| SEO-13  | Unassigned | Verification pending | TBD         | Owner reports existing controls beyond wireframe stage. Reconcile release/hosting settings with local root metadata before making changes.          |

## Reference guidance

- [Google Search Essentials](https://developers.google.com/search/docs/essentials)
- [People-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Crawlable links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- [Blocking indexing](https://developers.google.com/search/docs/crawling-indexing/block-indexing)
- [Sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization)
- [Site names](https://developers.google.com/search/docs/appearance/site-names)
- [Site migrations](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)
- [Search Console](https://developers.google.com/search/docs/monitor-debug/search-console-start)
- [Core Web Vitals](https://web.dev/articles/vitals)

Check the current platform and search documentation when implementing each task.
