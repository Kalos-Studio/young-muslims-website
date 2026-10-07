"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "What is YM?",
    answer: (
      <>
        Young Muslims is a national youth organization founded in the early
        1990s. Its local groups, called NeighborNets, gather weekly for halaqas,
        relevant discussions, activities, and meals. These gatherings help young
        Muslims learn and practice Islam while building supportive bonds with
        their peers.
      </>
    ),
  },
  {
    question: "How old do I have to be to join YM?",
    answer: <>Young Muslims serves youth and young adults ages 13 to 25.</>,
  },
  {
    question: "How do I start a YM NeighborNet?",
    answer: (
      <>
        Email the expansion team at{" "}
        <a
          href="mailto:expansion@ymsite.com"
          className="font-semibold text-brand-royal underline underline-offset-4"
        >
          expansion@ymsite.com
        </a>
        . They can connect you with nearby leadership and the resources needed
        to get started.
      </>
    ),
  },
  {
    question: "Does a YM group have to be affiliated with a specific masjid?",
    answer: (
      <>
        No. Some NeighborNets are the official youth groups of their local
        masajid, but affiliation is not required. A group can meet wherever best
        supports its growth and development.
      </>
    ),
  },
  {
    question: "Is YM co-ed? How can sisters join?",
    answer: (
      <>
        YM has independently operated brothers and sisters wings, and local
        gatherings are not mixed. The two wings coordinate at leadership levels.
        Sisters interested in joining or starting a NeighborNet can connect with
        the sisters wing through local YM leadership.
      </>
    ),
  },
  {
    question: "Where is YM?",
    answer: (
      <>
        YM has established regions and local NeighborNets across the country,
        with expansion teams actively helping new communities get started.
      </>
    ),
  },
  {
    question: "How long does it take to get started?",
    answer: (
      <>
        Getting started does not take long. Founders are asked to take the
        responsibility of maintaining their NeighborNet seriously.
      </>
    ),
  },
  {
    question: "Are there any membership fees?",
    answer: <>No, there are no membership fees.</>,
  },
] as const;

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section aria-labelledby="about-faq-heading">
      <h2
        id="about-faq-heading"
        className="text-section font-extrabold text-brand-royal"
      >
        Frequently asked questions
      </h2>

      <div className="mt-8 overflow-hidden rounded-card bg-muted px-8">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          const answerId = `about-faq-answer-${index}`;

          return (
            <div
              key={faq.question}
              className="border-b border-brand-obsidian/10 last:border-b-0"
            >
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full cursor-pointer items-center justify-between gap-8 py-6 text-left text-body font-semibold text-brand-obsidian outline-none hover:text-brand-royal focus-visible:text-brand-royal"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`size-5 shrink-0 transition-transform duration-300 ease-out ${isOpen ? "rotate-180" : ""}`}
                  strokeWidth={1.75}
                  aria-hidden
                />
              </button>
              <div
                id={answerId}
                aria-hidden={!isOpen}
                inert={!isOpen}
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <p className="max-w-3xl pb-6 text-body text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
