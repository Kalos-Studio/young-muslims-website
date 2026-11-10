/**
 * Renders schema.org structured data. A native script tag is correct here:
 * JSON-LD is data, not executable code, so `next/script` does not apply.
 * Escaping `<` keeps a stray "</script>" in the data from closing the tag.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
