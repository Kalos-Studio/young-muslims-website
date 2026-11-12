import { test } from "node:test";
import assert from "node:assert/strict";
import { sanityImageUrl } from "../src/lib/sanity-image";
import { sanityProjectId, sanityDataset } from "../src/lib/sanity-config";

const image = { asset: { _ref: "image-abc123-2000x1000-jpg" } };

test("images use the configured project and dataset", () => {
  const url = new URL(sanityImageUrl(image, 800, 800));
  assert.equal(
    url.pathname,
    `/images/${sanityProjectId}/${sanityDataset}/abc123-2000x1000.jpg`,
  );
});

test("square cards keep a hotspot near the right edge in view", () => {
  const centered = new URL(sanityImageUrl(image, 800, 800));
  const focused = new URL(
    sanityImageUrl(
      {
        ...image,
        hotspot: { x: 0.9, y: 0.5, width: 0.1, height: 0.1 },
      },
      800,
      800,
    ),
  );
  assert.equal(centered.searchParams.get("rect"), "500,0,1000,1000");
  assert.equal(focused.searchParams.get("rect"), "1000,0,1000,1000");
});

test("editor crop boundaries are retained", () => {
  const url = new URL(
    sanityImageUrl(
      {
        ...image,
        crop: { left: 0.2, right: 0.1, top: 0.1, bottom: 0.1 },
      },
      1400,
      800,
    ),
  );
  assert.equal(url.searchParams.get("rect"), "400,100,1400,800");
});

test("wide banners use their frame ratio when applying hotspots", () => {
  const url = new URL(
    sanityImageUrl(
      {
        ...image,
        hotspot: { x: 0.5, y: 0.9, width: 0.1, height: 0.1 },
      },
      1600,
      600,
    ),
  );
  assert.equal(url.searchParams.get("rect"), "0,250,2000,750");
  assert.equal(url.searchParams.get("w"), "1600");
  assert.equal(url.searchParams.get("h"), "600");
});
