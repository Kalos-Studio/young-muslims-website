import { cn } from "@/lib/utils";

/*
 * The tag's two tones: Royal on the Stories alumni cards, 24% Obsidian on
 * the About page's Shura cards. White text on both.
 */
const TAG_TONES = {
  royal: "bg-brand-royal",
  muted: "bg-brand-obsidian/24",
} as const;

/**
 * A team member card's text (Figma's Person text block): the tag (their
 * NeighborNet), their name and their role, 12 and 8 apart. Shared by the
 * Stories alumni cards (alumni-section.tsx) and the About page's Shura
 * cards (shura-section.tsx). A tag that is only "-" (Figma's empty tag) is
 * not rendered.
 */
export function TeamCardText({
  tag,
  name,
  role,
  tone = "royal",
  className,
}: {
  tag: string;
  name: string;
  role: string;
  tone?: keyof typeof TAG_TONES;
  className?: string;
}) {
  const showTag = tag.trim() !== "" && tag.trim() !== "-";
  return (
    <div className={className}>
      {showTag ? (
        <p
          className={cn(
            "mb-3 inline-block px-1.5 py-1 text-article-meta font-semibold text-brand-pure-white",
            TAG_TONES[tone],
          )}
        >
          {tag}
        </p>
      ) : null}
      <h3 className="text-article-title font-bold text-brand-obsidian">
        {name}
      </h3>
      <p className="mt-2 text-nav font-medium text-caption">{role}</p>
    </div>
  );
}
