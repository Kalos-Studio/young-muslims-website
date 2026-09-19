"use client";

import { useSyncExternalStore } from "react";

/**
 * WIREFRAME: visibility state for the yellow sticky notes.
 *
 * Two independent gates:
 *
 * 1. `enabled` — whether notes exist on this build at all. On in local dev, and
 *    on for Netlify deploy previews and branch deploys via NEXT_PUBLIC_SHOW_NOTES
 *    in netlify.toml. Deliberately off in production, so the day this branch
 *    serves the live domain the commentary is gone by configuration rather than
 *    by someone remembering to strip it.
 * 2. `visible` — the client's own toggle, so they can read the wireframe clean.
 *    Persisted per browser.
 *
 * `localStorage` is an external store that does not exist during server
 * rendering, which is exactly what useSyncExternalStore is for: the server
 * snapshot says visible, the client reads the real preference on hydration, and
 * React reconciles the difference itself. Doing this with useState + useEffect
 * instead would mean writing state from an effect and paying for a second
 * render pass.
 */

const NOTES_ENABLED =
  process.env.NEXT_PUBLIC_SHOW_NOTES === "true" ||
  process.env.NODE_ENV === "development";

const STORAGE_KEY = "ym-wireframe-notes-visible";

let listeners: Array<() => void> = [];
/** Cached so getSnapshot returns a stable value between writes. */
let cachedVisible: boolean | null = null;

function readStored(): boolean {
  try {
    // Anything other than an explicit "false" means show them.
    return window.localStorage.getItem(STORAGE_KEY) !== "false";
  } catch {
    // Private browsing or blocked storage. Notes just stay visible.
    return true;
  }
}

function subscribe(onChange: () => void) {
  listeners = [...listeners, onChange];
  return () => {
    listeners = listeners.filter((listener) => listener !== onChange);
  };
}

function getSnapshot(): boolean {
  cachedVisible ??= readStored();
  return cachedVisible;
}

function getServerSnapshot(): boolean {
  return true;
}

function setVisible(next: boolean) {
  cachedVisible = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, String(next));
  } catch {
    // Not being able to remember the choice is not worth breaking over.
  }
  for (const listener of listeners) listener();
}

export function useNotes() {
  const visible = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return {
    enabled: NOTES_ENABLED,
    visible,
    toggle: () => setVisible(!getSnapshot()),
  };
}
