"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

import articleMentalHealth from "../../design-assets/figma/landing-2026/new-sections/270-449-source-01.png";
import articleJudgement from "../../design-assets/figma/landing-2026/new-sections/270-488-source-01.jpeg";
import articleRamadan from "../../design-assets/figma/landing-2026/new-sections/270-503-source-01.png";

const REVEAL_EASE = [0.19, 1, 0.22, 1] as const;
const ARTICLE_STAGGER = 0.2;

const ARTICLES = [
  {
    title: "Muslim Youth Issues: Addressing Mental Health",
    image: articleMentalHealth,
    imageAlt: "Hands holding a heart cutout",
    objectPosition: "center",
    shape: "52% 48% 43% 57% / 42% 43% 57% 58%",
    mobileImageHeight: 292,
    body: "We aim to address the current state of mental health among American Muslim youth and assist with mental health struggles of any kind. This report also helps guide community leaders by providing a toolkit to directly support them wherever they may be.",
  },
  {
    title: "Muslim Youth Issues: Judgement Stigma",
    image: articleJudgement,
    imageAlt: "A group of Muslim women embracing outdoors",
    objectPosition: "center",
    shape: "45% 55% 48% 52% / 38% 45% 55% 62%",
    mobileImageHeight: 263,
    body: "The goal of the YM Presents Muslim Youth Issues: Judgment Stigma campaign is to seek the pleasure of Allah (swt) by raising awareness of judgment and shame within the American Muslim community, providing constructive criticism through education about Islam’s stance on this issue, and presenting practical solutions and strategies to counteract judgment stigma within our communities.",
  },
  {
    title: "How to Give a Khutbah",
    image: articleRamadan,
    imageAlt: "Worshippers inside a mosque",
    objectPosition: "center 58%",
    shape: "51% 49% 57% 43% / 42% 53% 47% 58%",
    mobileImageHeight: 293,
    body: "Young Muslims would like to present its first-ever Ramadan Survival Guide! We pray this guide brings benefits and helps you optimize how to spend your time this Ramadan. In it you can find a daily to-do checklist, duas, exciting challenges, and much more. Share with your friends, family, organizations, and the local community to reap the reward from it.",
  },
] as const;

type Article = (typeof ARTICLES)[number] & { image: StaticImageData };

function ArticleCard({
  article,
  index,
  isVisible,
  reduceMotion,
}: {
  article: Article;
  index: number;
  isVisible: boolean;
  reduceMotion: boolean | null;
}) {
  const delay = reduceMotion ? 0 : index * ARTICLE_STAGGER;

  return (
    <motion.article
      className="w-[296px] shrink-0 text-brand-obsidian md:w-[378px]"
      initial={false}
      animate={isVisible || reduceMotion ? "visible" : "hidden"}
      whileHover={reduceMotion ? undefined : "hover"}
      variants={{
        hidden: { opacity: 0, y: 28 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.65, delay, ease: REVEAL_EASE },
        },
      }}
    >
      <motion.div
        className="relative h-[min(var(--article-image-height),78.5vw)] w-[296px] overflow-hidden bg-brand-pure-white md:h-[378px] md:w-[378px]"
        style={
          {
            borderRadius: article.shape,
            "--article-image-height": `${article.mobileImageHeight}px`,
          } as CSSProperties
        }
        variants={{
          hidden: { opacity: 0, scale: 0.72 },
          visible: {
            opacity: 1,
            scale: 1,
            borderRadius: article.shape,
            transition: {
              opacity: { duration: 0.25, delay },
              scale: { duration: 0.8, delay, ease: REVEAL_EASE },
              borderRadius: { duration: 0 },
            },
          },
          hover: {
            borderRadius: "0%",
            transition: { duration: 0.65, ease: REVEAL_EASE },
          },
        }}
      >
        <motion.div
          className="absolute inset-0"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { duration: 0.55, delay: delay + 0.18 },
            },
          }}
        >
          <Image
            src={article.image}
            alt={article.imageAlt}
            fill
            sizes="(max-width: 767px) 296px, 378px"
            className="object-cover"
            style={{ objectPosition: article.objectPosition }}
          />
        </motion.div>
      </motion.div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold tracking-[-0.02em]">
          {article.title}
        </h3>
        <p className="mt-1 text-xs font-medium tracking-[-0.02em] text-brand-jade">
          October 1, 2026 <span className="px-1">•</span> Muneeb Syed
        </p>
        <p className="mt-3 text-sm font-medium tracking-[-0.02em]">
          {article.body}
        </p>
      </div>
    </motion.article>
  );
}

export function WordOnTheStreetSection() {
  const articlesRef = useRef<HTMLDivElement>(null);
  const articlesAreVisible = useInView(articlesRef, {
    once: true,
    amount: 0.2,
  });
  const reduceMotion = useReducedMotion();

  return (
    <section
      data-header-theme="light"
      className="relative h-[2084px] w-full overflow-hidden bg-brand-warm-snow md:h-[1024px]"
    >
      <div className="absolute top-0 left-1/2 h-full w-[360px] -translate-x-1/2 md:w-[1440px]">
        <div className="absolute top-[82px] left-8 flex w-[296px] flex-col items-stretch gap-8 md:top-[129px] md:left-[90px] md:w-[1270px] md:flex-row md:items-end">
          <div className="flex-1 text-brand-obsidian">
            <h2 className="text-[30px] leading-normal font-extrabold tracking-[-0.02em] md:text-landing-section">
              Word on the street.
            </h2>
            <p className="mt-4 text-base leading-normal font-medium tracking-[-0.02em] md:text-landing-copy">
              Straight from the NeighborNets — what&apos;s happening,
              what&apos;s coming up, and what we&apos;re thinking about.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex w-full justify-center bg-brand-royal px-6 py-4 text-nav font-bold text-brand-pure-white transition-colors hover:bg-brand-royal/80 focus-visible:ring-2 focus-visible:ring-brand-royal focus-visible:ring-offset-2 focus-visible:ring-offset-brand-warm-snow focus-visible:outline-none md:w-auto"
          >
            View latest
          </Link>
        </div>

        <div
          ref={articlesRef}
          className="absolute top-[348px] left-8 flex w-[296px] flex-col gap-[52px] md:top-[285px] md:left-[90px] md:w-[1270px] md:flex-row md:gap-[68px]"
        >
          {ARTICLES.map((article, index) => (
            <ArticleCard
              key={article.title}
              article={article}
              index={index}
              isVisible={articlesAreVisible}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
