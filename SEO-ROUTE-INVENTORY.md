# Current routes and pages

Inventory date: 2026-10-02. Source: the local `ongoing-build` checkout,
`src/app/**/page.tsx`, page metadata, and shared navigation. This is a source-code
inventory, not a crawl or verification of live search indexing.

## Approved indexing scope

The site owner has requested that **all eight current pages be indexed**. This
includes `/design-system`, replacing the previous checklist recommendation to
exclude it. No current page is deferred or excluded from the intended production
index. Local and preview environments retain the production-only indexing policy.

The documented production origin is `https://youngmuslims.com`. Paths below are
relative to that origin. Content owners remain unassigned; search purposes below
are proposals based on the current pages, not validated keyword research.

## Page inventory

| Route            | Source                                          | Page purpose / content                                                                           | Proposed search purpose                                    | Navigation discovery                                                                    | Production indexing decision                    | Content owner |
| ---------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------- | ------------- |
| `/`              | [Homepage](src/app/page.tsx)                    | Organization introduction, belonging, weekly groups, leadership, service, and highlight imagery. | Young Muslims; Muslim youth organization.                  | Header logo and drawer logo.                                                            | Index                                           | Unassigned    |
| `/about`         | [About](src/app/about/page.tsx)                 | Vision, mission, history, conferences, retreats, events, and FAQs.                               | What is Young Muslims; Young Muslims mission and programs. | Header and drawer: “Who We Are”; homepage link.                                         | Index                                           | Unassigned    |
| `/stories`       | [Stories](src/app/stories/page.tsx)             | Portraits and participant impact stories with a chapter-finder action.                           | Young Muslims member stories and experiences.              | Header and drawer: “Stories”.                                                           | Index                                           | Unassigned    |
| `/support`       | [Support](src/app/support/page.tsx)             | Case for giving, donation integration, mission, and supporter information.                       | Donate to Young Muslims; support Muslim youth programs.    | Header and drawer: “Support”.                                                           | Index                                           | Unassigned    |
| `/neighbornets`  | [NeighborNets](src/app/neighbornets/page.tsx)   | Local group finder with brothers’ and sisters’ chapter data, map, and results interface.         | Find a Muslim youth group; Young Muslims chapters near me. | Header CTA and drawer: “Find a Chapter”; stories link.                                  | Index                                           | Unassigned    |
| `/store`         | [Store](src/app/store/page.tsx)                 | Entry page for brothers’ and sisters’ merchandise destinations.                                  | Young Muslims merchandise and store.                       | Drawer: “Store”.                                                                        | Index                                           | Unassigned    |
| `/blog`          | [Blog](src/app/blog/page.tsx)                   | Featured resource and a grid of article summaries.                                               | Young Muslims articles and Muslim youth resources.         | Drawer: “Blog”.                                                                         | Index                                           | Unassigned    |
| `/design-system` | [Design system](src/app/design-system/page.tsx) | Brand colors, typography, design tokens, and component reference.                                | Young Muslims brand and website design system.             | Not in shared navigation; no incoming link found in the inspected site/page components. | Index, explicitly included in all-page decision | Unassigned    |

## Existing metadata

These are the declared page title values, before the root title template is
applied. Check actual rendered titles during SEO-06/PRE-03, particularly the
homepage's potential repeated brand name. All eight pages have metadata exports.

| Route            | Declared title     | Declared description                                                                                |
| ---------------- | ------------------ | --------------------------------------------------------------------------------------------------- |
| `/`              | Young Muslims      | A nationwide brotherhood and sisterhood, built on real friendships and a shared Deen.               |
| `/about`         | About              | What Young Muslims is and who it's for.                                                             |
| `/stories`       | Stories            | The impact YM has had on people, in their words.                                                    |
| `/support`       | Support            | Give to the work, and see where it goes.                                                            |
| `/neighbornets`  | Join a NeighborNet | Find a Young Muslims neighbornet near you: brothers' and sisters' circles across the United States. |
| `/store`         | Store              | The brothers' and sisters' stores.                                                                  |
| `/blog`          | Blog               | Writing from across the network.                                                                    |
| `/design-system` | Design system      | Young Muslims website design tokens and component reference.                                        |

## Current source behavior versus intended indexing

Implementation update: all eight pages now inherit environment-aware indexing
from the root layout and have individual canonical URLs. The design-system
override has been removed. Production builds with the indexing opt-in publish
all eight URLs in the sitemap; previews remain non-indexable. Deployment and
search-engine indexing are not verified. The following bullets preserve the
pre-implementation findings and are superseded by this update.

- The local [root layout](src/app/layout.tsx) declares
  `robots: { index: false, follow: false }`, inherited by pages without an override.
- The local design-system page independently declares the same restriction.
- Consequently, this checkout's metadata does not yet match the approved
  all-page production indexing decision. This does not establish what is deployed
  or what controls exist in other branches or hosting settings.
- This inventory changes the tracked decision, not running application behavior.
  SEO-13 covers reconciling the implementation, including `/design-system`.

## Page-specific follow-ups

These are observations to incorporate into the existing SEO tasks, not additional
reasons to exclude a page from the approved inventory.

- [ ] **Homepage / SEO-06:** Review descriptive search copy and the final title
      produced by the root title template.
- [ ] **About / SEO-05:** Replace remaining placeholder event/conference/retreat
      descriptions; the current page still imports and renders `Lorem`.
- [ ] **Stories / SEO-05:** Replace the explicitly invented example with approved
      participant stories and images.
- [ ] **Support / SEO-05, SEO-24:** Finalize remaining mission/giving copy and
      supporter examples; verify donation behavior and measurement.
- [ ] **NeighborNets / SEO-07:** Finalize placeholder introductory copy and confirm
      directory text and links are discoverable without map interaction. Reconcile
      geographical wording with the intended audience and verified chapter data.
- [ ] **Store / SEO-22:** Confirm actual merchandise destinations. The current
      brothers’ link targets `https://www.ymsite.com/`; coordinate it with legacy
      redirects. The sisters’ panel currently has no outbound store link.
- [ ] **Blog / SEO-09:** Replace sample dates/authors and provide article URLs.
      Current article cards are summaries, not separate article routes.
- [ ] **Design system / SEO-11, SEO-13, SEO-14:** Include this page in the production
      indexing implementation and sitemap, reconcile its explicit `noindex`, and
      add an appropriate crawlable incoming link without requiring a main-nav entry.

## Route boundaries

- Eight page routes were found, all literal paths with no dynamic segments.
- No individual chapter, article, story, event, or program detail routes exist.
- Components such as `about/faq-section.tsx`, map popups, and portrait sections
  are parts of pages, not additional routes.
- No application `route.ts` handlers, custom redirects, or robots/sitemap routes
  were found in this checkout. Framework endpoints and static assets are not
  counted as content pages here.
- Legacy-domain URLs and externally hosted stores require separate inventories
  under SEO-03 and SEO-22; they are not included in this eight-page count.

## Section 1 progress

- [x] Inventory all current page routes and source files.
- [x] Record the site owner's decision to index every current page.
- [x] Record the already documented production origin.
- [x] Draft each page's search purpose for later validation in SEO-04.
- [ ] Confirm target audience and geography.
- [ ] Assign a content owner to every page.
- [ ] Validate search purposes using baseline search data and content-owner input.

SEO-01 remains in progress until audience/geography and owners are confirmed.
See [SEO-CHECKLIST.md](SEO-CHECKLIST.md) for dependencies and test requirements.
