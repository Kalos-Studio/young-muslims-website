# Managing the YM blog

Run `bun run dev` in this Studio folder and open the printed URL. Run the website's `bun run dev` separately from the parent folder.

1. In Studio, select **Blog post**, then create a document.
2. Fill in the title and click **Generate** beside Slug. This becomes `/blog/your-slug` on the website; keep it stable after publication.
3. Add a summary, author, publication date, category, cover image and alternative text.
4. Write the article body. Paragraphs, headings, quotes, bold, italic, links and lists are supported.
5. Enable **Featured** to include the post in the blog's top carousel.
6. Click **Publish**, then refresh the website's `/blog` page.

Drafts are not displayed. The publication date is a display field, not a scheduler. Published posts are fetched on each visit, so a site rebuild is not required for content edits. A page already open must be refreshed. Unpublishing removes a CMS-only article from the website.

The website uses project `mygi3vn8`, dataset `production`, with published-only public reads. No write token is needed in the website. Do not place secrets in public environment variables.

Existing resource posts remain in `src/lib/blog.ts` in the website until they are migrated. A published Sanity post with the same slug replaces its legacy content. Unpublishing that override restores the legacy resource. If no CMS posts are featured, the original featured resources remain in the carousel.

Studio runs locally for now. Making this admin interface available to other editors will require a separate Studio deployment. This integration does not publish or migrate any existing articles into Sanity.

Validation: run `bunx tsc --noEmit` and `bun run build` here. Run website checks from the parent folder; its TypeScript and ESLint configuration excludes this independent Studio app.
