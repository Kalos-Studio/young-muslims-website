import { EditorialPhoto } from "@/components/site/editorial";
import gathering from "../../../design-assets/photos/10-24 photo 4f12c6ee-464d-45a1-94df-ef28e34518e3.jpg";

export function VisionMissionHistory() {
  return (
    <section
      aria-labelledby="purpose-heading"
      className="bg-primary py-20 text-primary-foreground"
      data-header-theme="dark"
    >
      <div className="mx-auto grid max-w-7xl gap-20 px-8 lg:grid-cols-2 lg:px-20">
        <div>
          <p className="text-nav font-bold">Our purpose</p>
          <h2
            id="purpose-heading"
            className="mt-6 text-mobile-section font-extrabold md:text-section"
          >
            Grounded in Deen.
            <br />
            Working for good.
          </h2>
          <EditorialPhoto
            src={gathering}
            alt="Sisters gathered together holding their floral arrangements"
            className="mt-8 aspect-square"
          />
        </div>
        <div className="space-y-8 lg:pt-20">
          <div className="border-b border-border pb-8">
            <h3 className="text-card-title font-semibold">Our mission</h3>
            <p className="mt-4 text-lead font-medium">
              Young Muslims seeks the pleasure of Allah (SWT) by empowering
              Muslim youth through companionship, mentorship, education, and
              service.
            </p>
          </div>
          <div className="border-b border-border pb-8">
            <h3 className="text-card-title font-semibold">Our vision</h3>
            <p className="mt-4 text-body">
              American Muslim youth collectively contributing to the betterment
              of society with God-consciousness and a firm understanding of
              their Muslim identity.
            </p>
          </div>
          <div>
            <p className="font-display text-stat">1995</p>
            <h3 className="mt-4 text-card-title font-semibold">
              Local roots. A national family.
            </h3>
            <p className="mt-4 text-body">
              Our story started with youth groups in northern New Jersey, New
              York City, and Chicago in the early 1990s. A shared vision brought
              them together, and in 1995, Young Muslims established its first
              charter and national coordinator.
            </p>
            <p className="mt-4 text-body">
              Our history follows the same path as our work today: local groups
              coming together to carry a shared Islamic purpose further.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
