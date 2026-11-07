import { entryPhotos } from "./entry-photos";
import styles from "./entry-screen.module.css";
import { YmComposition } from "./ym-composition";

/**
 * The entry screen: the stacked YM composition on Warm Snow, its wordmark a
 * window onto group photos, which `EntryAnimation` flashes by switching each
 * `[data-entry-photo]` layer's opacity. Server-rendered so it is on screen at
 * first paint.
 */
export function EntryScreen() {
  return (
    <div className={`${styles.screen} bg-brand-warm-snow`}>
      <YmComposition variant="photos" photos={entryPhotos} />
    </div>
  );
}
