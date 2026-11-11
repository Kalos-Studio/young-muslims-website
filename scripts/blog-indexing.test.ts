import { test } from "node:test";
import assert from "node:assert/strict";
import { isBlogPostIndexable, type BlogPost } from "../src/lib/blog";

const post: BlogPost = {
  id: "test",
  title: "Test",
  excerpt: "Summary only",
  category: "Article",
  image: "/test.jpg",
};

test("excerpt-only resources stay out of search", () => {
  assert.equal(isBlogPostIndexable(post), false);
});

test("complete legacy articles remain indexable", () => {
  assert.equal(
    isBlogPostIndexable({
      ...post,
      content: [{ type: "paragraph", text: "Full article" }],
    }),
    true,
  );
});

test("published Sanity article text is recognized without legacy content", () => {
  assert.equal(
    isBlogPostIndexable({
      ...post,
      body: [
        {
          _type: "block",
          _key: "body",
          children: [
            {
              _type: "span",
              _key: "text",
              text: "Full CMS article",
              marks: [],
            },
          ],
          markDefs: [],
          style: "normal",
        },
      ],
    }),
    true,
  );
});

test("empty Sanity editors do not make articles indexable", () => {
  assert.equal(isBlogPostIndexable({ ...post, body: [] }), false);
  assert.equal(
    isBlogPostIndexable({
      ...post,
      body: [
        {
          _type: "block",
          _key: "body",
          children: [{ _type: "span", _key: "text", text: "   ", marks: [] }],
          markDefs: [],
          style: "normal",
        },
      ],
    }),
    false,
  );
});
