import Image from "next/image";
import { ScrollConnector } from "./scroll-connector";
import { LeadershipSection } from "./leadership-section";
import { EditorialLink } from "@/components/site/editorial";
import localCircle from "../../../design-assets/photos/10-24 photo e5fd60bf-1224-4e3a-b160-e26d53766b0d.jpg";
import brothers from "../../../design-assets/figma/landing-2026/card-people.jpeg";
import sisters from "../../../design-assets/photos/10-24 photo 94d87ad5-b299-441c-82d5-7752c50a711c.jpg";
import nationalGathering from "../../../design-assets/figma/landing-2026/new-sections/208-3-source-04.jpeg";

/** The composition grows from one circle, to connected groups, to a shared gathering. */
export function LocalToNational() {
  return (
    <section
      id="local-to-national"
      className="scroll-mt-40"
      aria-label="From your neighborhood to a national movement"
    >
      <div
        data-header-theme="light"
        className="mx-auto max-w-7xl px-8 pt-20 lg:px-20"
      >
        <div className="mx-auto max-w-lg text-center">
          <p className="text-nav font-bold text-accent">01 / Local</p>
          <h2 className="mt-4 text-mobile-section font-extrabold md:text-section">
            It starts with
            <br />
            one circle.
          </h2>
          <figure className="mt-8">
            <Image
              src={localCircle}
              alt="Sisters seated together for an outdoor halaqa beneath the trees"
              sizes="(max-width: 767px) 100vw, 512px"
              className="aspect-video w-full rounded-media object-cover"
            />
            <figcaption className="mt-6 text-card-title font-semibold">
              Your people. Your NeighborNet.
            </figcaption>
          </figure>
          <p className="mx-auto mt-4 max-w-md text-body">
            A weekly halaqa, a shared meal, a game after prayer. Faith and
            friendship grow in the everyday.
          </p>
        </div>

        <ScrollConnector />

        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-nav font-bold text-accent">02 / Regional</p>
            <h2 className="mt-4 text-mobile-section font-extrabold md:text-section">
              Your circle
              <br />
              meets others.
            </h2>
          </div>
          <ScrollConnector branch />
          <div className="grid grid-cols-2 gap-4 md:gap-8">
            <Image
              src={brothers}
              alt="A group of brothers gathered together on a rocky beach"
              sizes="(max-width: 767px) 50vw, 448px"
              className="aspect-video w-full rounded-media object-cover"
            />
            <Image
              src={sisters}
              alt="A large group of sisters gathered beside a lake"
              sizes="(max-width: 767px) 50vw, 448px"
              className="aspect-video w-full rounded-media object-cover"
            />
          </div>
          <div className="mx-auto mt-6 max-w-lg text-center">
            <h3 className="text-card-title font-semibold">
              More chapters. Shared growth.
            </h3>
            <p className="mt-4 text-body">
              Regional connections bring local chapters together through
              retreats, learning, and leadership. The friendships grow. So does
              the responsibility.
            </p>
          </div>
        </div>
        <ScrollConnector arrow={false} />
      </div>

      <div
        className="bg-secondary text-secondary-foreground"
        data-header-theme="dark"
      >
        <ScrollConnector inverse />
        <div className="mx-auto max-w-7xl px-8 lg:px-20">
          <div className="text-center">
            <p className="text-nav font-bold">03 / National</p>
            <h2 className="mt-4 text-mobile-section font-extrabold md:text-section">
              Many circles.
              <br />
              One shared purpose.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lead font-medium">
              Local roots become a national force for Islamic work, service, and
              advocacy.
            </p>
          </div>
          <figure className="mt-8">
            <Image
              src={nationalGathering}
              alt="A crowded Young Muslims gathering, with members filling the hall together"
              sizes="(max-width: 1279px) 100vw, 1120px"
              className="aspect-video w-full rounded-media object-cover"
            />
            <figcaption className="mt-6 text-center text-body">
              The same faith and friendships, connected across the country.
            </figcaption>
          </figure>
          <div className="mt-8 grid gap-6 border-t border-current py-8 text-center md:grid-cols-3">
            <p className="text-card-title font-semibold">Growing in Deen</p>
            <p className="text-card-title font-semibold">Serving together</p>
            <p className="text-card-title font-semibold">
              Speaking up together
            </p>
          </div>
        </div>
      </div>
      <LeadershipSection />
      <div
        data-header-theme="light"
        className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-8 py-8 md:flex-row lg:px-20"
      >
        <p className="text-lead font-medium">
          A bigger movement starts close to home.
        </p>
        <EditorialLink href="/neighbornets">
          Find your local chapter
        </EditorialLink>
      </div>
    </section>
  );
}
