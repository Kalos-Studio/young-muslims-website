"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "motion/react";

const FooterPageContext = createContext<{
  pageY: MotionValue<number>;
  footerEdgeOffset: MotionValue<number>;
  montageHost: HTMLDivElement | null;
} | null>(null);

/** Keep the montage outside the moving page so it is uncovered at the bottom. */
export function FooterPageStage({
  header,
  children,
}: {
  header: ReactNode;
  children: ReactNode;
}) {
  const pageY = useMotionValue(0);
  const footerEdgeOffset = useMotionValue(0);
  const montageClip = useTransform(
    () =>
      `inset(${Math.max(0, Math.min(200, 200 + pageY.get() + footerEdgeOffset.get()))}px 0 0 0)`,
  );
  const [montageHost, setMontageHost] = useState<HTMLDivElement | null>(null);
  const value = useMemo(
    () => ({ pageY, footerEdgeOffset, montageHost }),
    [pageY, footerEdgeOffset, montageHost],
  );

  return (
    <FooterPageContext.Provider value={value}>
      {header}
      <motion.div
        ref={setMontageHost}
        data-footer-montage-host
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-0 h-50 overflow-hidden"
        style={{ clipPath: montageClip }}
      />
      <motion.div
        data-site-page-stage
        className="relative z-10 flex flex-1 flex-col bg-background"
        style={{ y: pageY }}
      >
        {children}
      </motion.div>
    </FooterPageContext.Provider>
  );
}

export function useFooterPageStage() {
  const context = useContext(FooterPageContext);
  if (!context) throw new Error("SiteFooter must be inside FooterPageStage");
  return context;
}
