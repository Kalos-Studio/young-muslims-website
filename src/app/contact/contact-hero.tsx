import Image from "next/image";
import contactPhoto from "../../../design-assets/photos/10-24 photo 3732c992-31fc-4c67-8d1c-abe434b1a996.jpg";
import { EditorialLink } from "@/components/site/editorial";

export function ContactHero() {
  return (
    <section
      aria-labelledby="contact-title"
      data-header-theme="dark"
      className="relative isolate overflow-hidden bg-primary text-primary-foreground"
    >
      <Image
        src={contactPhoto}
        alt="Sisters embracing beside a lake"
        fill
        preload
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-primary/60"
      />
      <div className="mx-auto flex max-w-screen-2xl flex-col items-center gap-20 px-8 pt-40 pb-40 md:px-20 lg:pt-60 lg:pb-60">
        <div className="flex w-full flex-col items-center text-center">
          <h1
            id="contact-title"
            className="max-w-5xl font-display text-mobile-display uppercase lg:text-display"
          >
            It starts
            <br />
            with a salaam.
          </h1>
          <p className="mt-6 max-w-2xl text-nav font-semibold lg:text-lead">
            Looking for your people? Have an idea for your community? Let&apos;s
            help you take the next step.
          </p>
        </div>
        <section
          aria-labelledby="contact-form-heading"
          className="flex min-h-160 w-full max-w-2xl flex-col rounded-card bg-background p-6 text-foreground md:p-8"
        >
          <h2
            id="contact-form-heading"
            className="text-card-title font-semibold"
          >
            Tell us what you need.
          </h2>
          <p className="mt-4 text-body text-muted-foreground">
            A question, an idea, or your first hello. We&apos;re glad
            you&apos;re here.
          </p>
          {/* Replace this fallback with the Jotform embed when its form URL is available. */}
          <div
            data-contact-form-slot
            className="mt-8 flex flex-1 flex-col items-center justify-center rounded-media border border-dashed border-border p-6 text-center"
          >
            <p className="text-card-title font-semibold">
              Our contact form is on its way.
            </p>
            <p className="mt-4 max-w-sm text-body text-muted-foreground">
              In the meantime, explore the ways to connect with YM below.
            </p>
            <div className="mt-8">
              <EditorialLink href="#connect">Find your way in</EditorialLink>
            </div>
          </div>
        </section>
      </div>
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 170"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 w-full text-muted lg:h-40"
      >
        <path
          d="M0 32C345 119 1028 126 1440 78V170H0V32Z"
          fill="currentColor"
        />
      </svg>
    </section>
  );
}
