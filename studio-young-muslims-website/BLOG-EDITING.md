# Managing the YM blog

Open [Young Muslims Studio](https://young-muslims-website.sanity.studio/) and sign in with the account invited to the Young Muslims Sanity project. No local installation is needed to edit articles. A project administrator can invite editors through [Sanity Manage](https://www.sanity.io/manage/project/mygi3vn8).

1. In Studio, select **Blog post**, then create a document.
2. Fill in the title and click **Generate** beside Slug. This becomes `/blog/your-slug` on the website; keep it stable after publication.
3. Add a summary, author, publication date, category, cover image and alternative text. Open the image editor to crop unwanted edges and move the hotspot over the subject to keep visible. The website applies these settings to cards, featured images, and article banners.
4. Write the article body. Paragraphs, headings, quotes, bold, italic, links and lists are supported.
5. Enable **Featured** to include the post in the blog's top carousel.
6. Click **Publish**, then refresh the website's `/blog` page.

Drafts are not displayed. The publication date is a display field, not a scheduler. Published posts are fetched on each visit, so a site rebuild is not required for content edits. A page already open must be refreshed. Unpublishing removes a CMS-only article from the website.

The checked-in `.env` files contain only public defaults for the current project and dataset. The website reads `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`; Studio reads `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET`. Override these through ignored `.env.local` files or hosting environment variables. Keep website and Studio settings aligned. Website variables are fixed at build time, so rebuild after changing them. No write token is needed in the website. Never add tokens or secrets to the tracked `.env` files or public environment variables.

Existing resource posts remain in `src/lib/blog.ts` in the website until they are migrated. A published Sanity post with the same slug replaces its legacy content. Unpublishing that override restores the legacy resource. If no CMS posts are featured, the original featured resources remain in the carousel.

For development, run `bun run dev` in this Studio folder, and run the website separately from the parent folder. All environments still use the production dataset by default; a separate development dataset has not been created.

After changing Studio code or schemas, run `bun run deploy` from this folder while signed into Sanity. `SANITY_STUDIO_APP_ID` identifies the existing hosted Studio, so subsequent deploys update the same URL. Publishing articles does not require this command. This integration does not publish or migrate any existing articles into Sanity.

Validation: run `bunx tsc --noEmit` and `bun run build` here. Run website checks from the parent folder; its TypeScript and ESLint configuration excludes this independent Studio app.
