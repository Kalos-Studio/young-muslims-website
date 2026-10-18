"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import Link from "next/link";
import type { BlogPost } from "@/lib/blog";

type CategoryFilter = "All" | "Resources" | "Articles" | "Toolkits";
type SortOrder = "Newest" | "Oldest" | "A–Z";

const categories: CategoryFilter[] = [
  "All",
  "Resources",
  "Articles",
  "Toolkits",
];
const sortOrders: SortOrder[] = ["Newest", "Oldest", "A–Z"];

function parseDate(date?: string) {
  return date ? new Date(date).getTime() : 0;
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5 shrink-0 fill-none stroke-current"
      strokeWidth="1.8"
    >
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`size-5 transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function AuthorIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5 fill-none stroke-current"
      strokeWidth="1.6"
    >
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5.5 20c.4-3.4 2.8-5.2 6.5-5.2s6.1 1.8 6.5 5.2" />
    </svg>
  );
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <article id={`post-${post.id}`} className="flex min-w-0 flex-col gap-5">
      <Link
        href={`/blog/${post.id}`}
        aria-label={`Read ${post.title}`}
        className="group block outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <figure className="relative h-96 overflow-hidden bg-muted md:aspect-square md:h-auto">
          <Image
            src={post.image}
            alt=""
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 45vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
          />
          <figcaption className="absolute top-5 left-5 bg-foreground/80 px-2 py-1 text-nav font-semibold text-background backdrop-blur-sm">
            {post.category}
          </figcaption>
        </figure>
      </Link>

      <div className="flex flex-col gap-3">
        {(post.date || post.read) && (
          <p className="flex gap-2 text-nav font-medium text-accent">
            <span>{post.date}</span>
            {post.date && post.read && <span aria-hidden="true">·</span>}
            <span>{post.read}</span>
          </p>
        )}
        <h3 className="text-body leading-snug font-semibold text-foreground">
          <Link
            href={`/blog/${post.id}`}
            className="transition-colors hover:text-secondary focus-visible:outline-2 focus-visible:outline-ring"
          >
            {post.title}
          </Link>
        </h3>
        <p className="text-nav leading-relaxed font-medium text-muted-foreground md:text-body md:font-normal">
          {post.excerpt}
        </p>
        {post.author && (
          <div className="mt-1 flex items-center gap-2">
            <span className="grid size-6 shrink-0 place-items-center rounded-pill bg-brothers-slate text-background">
              <AuthorIcon />
            </span>
            <span className="text-nav font-semibold text-foreground">
              {post.author}
            </span>
          </div>
        )}
      </div>
    </article>
  );
}

export function BlogInteractions({ posts }: { posts: BlogPost[] }) {
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("Newest");
  const [sortOpen, setSortOpen] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const sortTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!sortOpen) return;

    function closeOnOutsideClick(event: PointerEvent) {
      if (!sortMenuRef.current?.contains(event.target as Node))
        setSortOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSortOpen(false);
        sortTriggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [sortOpen]);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const filtered = posts.filter((post) => {
      const matchesCategory =
        category === "All" || `${post.category}s` === category;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${post.title} ${post.excerpt} ${post.author ?? ""} ${post.category}`
          .toLocaleLowerCase()
          .includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });

    return [...filtered].sort((first, second) => {
      if (sortOrder === "A–Z") return first.title.localeCompare(second.title);
      const dateDifference = parseDate(first.date) - parseDate(second.date);
      return sortOrder === "Newest" ? -dateDifference : dateDifference;
    });
  }, [category, posts, query, sortOrder]);

  return (
    <section id="blog-articles" aria-labelledby="blog-section-title">
      <div className="flex flex-col gap-4">
        <h2
          id="blog-section-title"
          className="text-mobile-section font-extrabold text-foreground md:text-section"
        >
          What we’ve been talking about.
        </h2>
        <p className="text-body font-medium text-foreground md:text-lead">
          Reflections, recaps, and what’s happening across the NeighborNets.
          Straight from the people living it.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4 md:mt-10 md:gap-5 xl:flex-row xl:items-center xl:justify-between">
        <label className="relative block md:hidden">
          <span className="sr-only">Filter articles by category</span>
          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as CategoryFilter)
            }
            className="w-full appearance-none border border-foreground bg-background py-4 pr-12 pl-4 text-nav font-bold text-foreground outline-none hover:border-secondary focus-visible:ring-2 focus-visible:ring-ring"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
            <ChevronIcon open={false} />
          </span>
        </label>
        <div
          role="group"
          aria-label="Filter articles by category"
          className="hidden w-fit max-w-full gap-1 overflow-x-auto bg-muted p-1.5 md:flex"
        >
          {categories.map((item) => {
            const active = category === item;
            return (
              <button
                key={item}
                type="button"
                aria-pressed={active}
                onClick={() => setCategory(item)}
                className={`shrink-0 px-3 py-3 text-nav transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset ${
                  active
                    ? "bg-background font-bold text-foreground"
                    : "font-semibold text-foreground hover:bg-background/70 hover:text-secondary"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        <div className="flex min-w-0 items-start gap-4 md:gap-3">
          <label className="flex min-w-0 flex-1 items-center gap-3 border-b border-foreground px-4 py-4 transition-colors focus-within:border-secondary focus-within:text-secondary hover:border-secondary hover:text-secondary motion-reduce:transition-none md:w-60 md:flex-none">
            <SearchIcon />
            <span className="sr-only">Search blog posts</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search blog..."
              className="min-w-0 flex-1 bg-transparent text-nav font-semibold text-foreground outline-none placeholder:text-muted-foreground"
            />
          </label>

          <div ref={sortMenuRef} className="relative shrink-0">
            <button
              ref={sortTriggerRef}
              type="button"
              aria-expanded={sortOpen}
              onClick={() => setSortOpen((open) => !open)}
              className="flex w-full items-center justify-between gap-1 border border-foreground px-4 py-4 text-left text-nav font-bold text-foreground transition-colors outline-none hover:border-secondary hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring md:w-40 md:gap-4"
            >
              {sortOrder}
              <ChevronIcon open={sortOpen} />
            </button>
            {sortOpen && (
              <div
                role="group"
                aria-label="Sort articles"
                className="absolute top-full right-0 z-20 mt-1 w-full border border-border bg-popover p-1 md:w-48"
              >
                {sortOrders.map((order) => (
                  <button
                    key={order}
                    type="button"
                    aria-pressed={sortOrder === order}
                    onClick={() => {
                      setSortOrder(order);
                      setSortOpen(false);
                    }}
                    className="block w-full px-3 py-3 text-left text-nav font-semibold text-popover-foreground transition-colors outline-none hover:bg-muted hover:text-secondary focus-visible:bg-muted focus-visible:text-secondary"
                  >
                    {order}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {filteredPosts.length}{" "}
        {filteredPosts.length === 1 ? "article" : "articles"} found
      </p>
      {filteredPosts.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-y-14 xl:grid-cols-3">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="mt-10 border-y border-border py-8 text-body text-muted-foreground">
          No articles match your search. Try another keyword or category.
        </p>
      )}
    </section>
  );
}
