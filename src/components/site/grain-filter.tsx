/**
 * The site's film grain, as SVG filter primitives: fractal noise (static, so
 * it is safe under reduced motion) laid over the source as
 * source + 0.24 x (noise - 0.5), speckle that does not shift the average
 * colour, kept inside the source's own shape. Used by the entry screen's
 * wordmark and monograms and by the NeighborNets hero's photo.
 *
 * Render <GrainPrimitives /> inside a <filter> (the entry screen's, inside
 * its own SVG), or <GrainFilter id="…" /> to define a standalone filter that
 * an element applies with CSS `filter: url(#id)`.
 */
export function GrainPrimitives() {
  return (
    <>
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.85"
        numOctaves={2}
        seed={7}
        stitchTiles="stitch"
        result="noise"
      />
      {/* The noise's alpha channel, centred near 0.5, as opaque grey. Its
          colour channels are premultiplied and would darken. */}
      <feColorMatrix
        in="noise"
        type="matrix"
        values="0 0 0 1 0  0 0 0 1 0  0 0 0 1 0  0 0 0 0 1"
        result="grain"
      />
      {/* Source + 0.24 x (grain - 0.5): speckle without shifting the
          average colour. */}
      <feComposite
        in="SourceGraphic"
        in2="grain"
        operator="arithmetic"
        k1="0"
        k2="1"
        k3="0.24"
        k4="-0.12"
        result="grained"
      />
      <feComposite in="grained" in2="SourceGraphic" operator="in" />
    </>
  );
}

/** A standalone, invisible SVG defining the grain filter as `id`. */
export function GrainFilter({ id }: { id: string }) {
  return (
    <svg aria-hidden width="0" height="0" className="absolute">
      <filter
        id={id}
        x="0"
        y="0"
        width="1"
        height="1"
        colorInterpolationFilters="sRGB"
      >
        <GrainPrimitives />
      </filter>
    </svg>
  );
}
