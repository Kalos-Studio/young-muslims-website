import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "@portabletext/react";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => (
      <h2 className="pt-6 text-card-title font-semibold">{children}</h2>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-border pl-6 italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc space-y-3 pl-6">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal space-y-3 pl-6">{children}</ol>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "";
      if (!/^(https?:\/\/|mailto:)/i.test(href)) return <>{children}</>;
      return (
        <a href={href} className="text-secondary underline underline-offset-4">
          {children}
        </a>
      );
    },
  },
};

export function ArticleBody({ body }: { body: PortableTextBlock[] }) {
  return <PortableText value={body} components={components} />;
}
