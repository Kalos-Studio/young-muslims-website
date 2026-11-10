"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";

import standardButton from "@/components/ui/standard-button.module.css";
import { readRootToken } from "@/lib/shape-motion";
import { cn } from "@/lib/utils";

import clearIcon from "../../../design-assets/figma/neighbornets/map/search/close.svg";
import searchIcon from "../../../design-assets/figma/neighbornets/map/search/search.svg";
import { useFinder } from "./map-finder";
import {
  prepareSearch,
  resolveSearch,
  resultFor,
  suggest,
  type SearchOptions,
  type SearchResult,
  type Suggestion,
} from "./map-search";
import styles from "./neighbornets-map-search.module.css";

const DEFAULTS: SearchOptions = {
  radiusMiles: 25,
  nearestCount: 3,
  suggestionCount: 6,
};

/** The search options, from the map's search tokens. */
function readOptions(): SearchOptions {
  const number = (name: string, fallback: number) =>
    Number.parseFloat(readRootToken(name, String(fallback))) || fallback;
  return {
    radiusMiles: number("--neighbornets-map-search-radius", 25),
    nearestCount: number("--neighbornets-map-search-nearest", 3),
    suggestionCount: number("--neighbornets-map-search-suggestions", 6),
  };
}

/**
 * The NeighborNets finder's search (Figma 371:394, tablet 401:2181, mobile
 * 401:3214): "Search for city or ZIP", underlined, with the search icon, a
 * clear button once there is text, and the arrow button that submits (Figma
 * 370:120): a Royal underline that rises into a Royal fill on hover or
 * focus as its arrow rolls through, beside the field (under it, full width,
 * on phones).
 *
 * A combobox: as you type it suggests states, places and NeighborNets
 * (map-search.ts, all local), which the arrow keys move through and Enter or
 * a click takes. Submitting resolves the query and opens the map's result
 * through the finder (NeighborNetsFinder): a state as a click on it does; a
 * place or a NeighborNet's name as "Results for ‘…’", zoomed to them; a
 * place with none in reach as the nearest; anything else says it was not
 * found. `?q=` opens a search on load.
 */
export function NeighborNetsMapSearch() {
  const finderRef = useFinder();
  const inputRef = useRef<HTMLInputElement>(null);
  const options = useRef<SearchOptions>(DEFAULTS);
  const latest = useRef("");
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState(-1);
  const [message, setMessage] = useState("");
  const id = useId();
  const listId = `${id}-list`;
  const optionId = (index: number) => `${id}-option-${index}`;

  /** Suggestions for `text`: what is loaded now, then again once loaded. */
  const update = useCallback((text: string) => {
    latest.current = text;
    setSuggestions(suggest(text, options.current));
    setActive(-1);
    void prepareSearch(text).then(() => {
      if (latest.current === text)
        setSuggestions(suggest(text, options.current));
    });
  }, []);

  /** Open a result on the map (or say it was not found). */
  const open = useCallback(
    (result: SearchResult, settle = true) => {
      setExpanded(false);
      setActive(-1);
      if (result.kind === "none") {
        setMessage(`We couldn’t find ‘${result.query}’`);
        return;
      }
      setMessage("");
      finderRef?.current?.(
        result.kind === "state"
          ? { kind: "state", code: result.code }
          : { kind: "search", result },
      );
      // The keyboard down (phones), so the map and its panel show.
      if (settle) inputRef.current?.blur();
    },
    [finderRef],
  );

  const choose = (suggestion: Suggestion) => {
    setValue(suggestion.label);
    latest.current = suggestion.label;
    open(resultFor(suggestion, options.current));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (expanded && active >= 0 && suggestions[active]) {
      choose(suggestions[active]);
      return;
    }
    if (!value.trim()) return;
    open(await resolveSearch(value, options.current));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const count = suggestions.length;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (count === 0) return;
      event.preventDefault();
      setExpanded(true);
      // Through the options and back to the field (-1), wrapping.
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((index) => {
        const next = index + step;
        return next < -1 ? count - 1 : next >= count ? -1 : next;
      });
      return;
    }
    if (event.key === "Escape") {
      // The list closes first; the map's own Escape (its panel) waits.
      if (expanded && count > 0) {
        event.stopPropagation();
        setExpanded(false);
        setActive(-1);
      }
    }
  };

  // The tokens, and a `?q=` search once the page has entered.
  useEffect(() => {
    options.current = readOptions();
    const query = new URLSearchParams(window.location.search).get("q");
    if (!query) return;
    let waiting = 0;
    const start = async () => {
      if (
        document.querySelector("[data-entry-animation]") ||
        !finderRef?.current
      ) {
        waiting = window.setTimeout(start, 100);
        return;
      }
      setValue(query);
      latest.current = query;
      open(await resolveSearch(query, options.current), false);
    };
    waiting = window.setTimeout(start, 0);
    return () => window.clearTimeout(waiting);
  }, [finderRef, open]);

  const showList = expanded && suggestions.length > 0;

  return (
    <form
      role="search"
      aria-label="NeighborNets"
      onSubmit={submit}
      className="relative mt-8 flex flex-col gap-4 md:mt-15 md:flex-row"
    >
      <div className="relative flex min-w-0 flex-1 items-center gap-3 border-b border-brand-obsidian p-4 focus-within:border-brand-royal">
        <Image src={searchIcon} alt="" className="size-4.5 shrink-0" />
        <label htmlFor={`${id}-input`} className="sr-only">
          Search for a city, state, ZIP or NeighborNet
        </label>
        <input
          ref={inputRef}
          id={`${id}-input`}
          type="text"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          spellCheck={false}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showList}
          aria-controls={listId}
          aria-activedescendant={
            showList && active >= 0 ? optionId(active) : undefined
          }
          aria-describedby={`${id}-status`}
          placeholder="Search for city or ZIP"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setMessage("");
            setExpanded(true);
            update(event.target.value);
          }}
          onFocus={() => {
            if (value) setExpanded(true);
          }}
          onBlur={() => setExpanded(false)}
          onKeyDown={onKeyDown}
          className="min-w-0 flex-1 bg-transparent text-nav font-bold text-brand-obsidian outline-none placeholder:font-medium placeholder:text-caption"
        />
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setValue("");
              setMessage("");
              update("");
              inputRef.current?.focus();
            }}
            className="flex size-4.5 shrink-0 cursor-pointer items-center justify-center outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-royal"
          >
            <Image src={clearIcon} alt="" className="size-4.5" />
          </button>
        )}
        <ul
          id={listId}
          role="listbox"
          aria-label="Suggestions"
          hidden={!showList}
          className="absolute inset-x-0 top-full z-20 mt-1 bg-brand-pure-white py-2 shadow-neighbornets-search"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.kind}:${suggestion.label}:${index}`}
              id={optionId(index)}
              role="option"
              aria-selected={index === active}
              // Keep the field's focus (and the list) through the click.
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(suggestion)}
              onMouseMove={() => setActive(index)}
              className={cn(
                "flex cursor-pointer items-baseline justify-between gap-3 px-4 py-2.5",
                index === active && "bg-neighbornets-search-active",
              )}
            >
              <span className="min-w-0 truncate text-nav font-bold text-brand-obsidian">
                {suggestion.label}
              </span>
              {suggestion.detail && (
                <span className="shrink-0 text-article-meta font-medium text-caption">
                  {suggestion.detail}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
      {/* Figma 370:120: the standard button's underline, rising into a Royal
          fill on hover or focus, and its arrow on a Royal tile that merges
          into the fill as the arrow rolls through (out right, in from the
          left). The same at every width (full width on phones). */}
      <button
        type="submit"
        aria-label="Search"
        className={cn(
          "ym-cta-trigger relative isolate flex w-full shrink-0 cursor-pointer items-center justify-center p-4 outline-none focus-visible:ring-2 focus-visible:ring-brand-royal focus-visible:ring-offset-2 focus-visible:ring-offset-brand-warm-snow md:w-auto",
          standardButton.button,
        )}
      >
        <span
          aria-hidden
          className="ym-cta-arrow ym-cta-arrow--horizontal size-4.5 bg-brand-royal text-brand-warm-snow"
        >
          <span
            className={cn(
              "ym-cta-arrow__icon ym-cta-arrow__icon--current",
              styles.arrow,
            )}
          />
          <span
            className={cn(
              "ym-cta-arrow__icon ym-cta-arrow__icon--next",
              styles.arrow,
            )}
          />
        </span>
      </button>
      <p
        id={`${id}-status`}
        role="status"
        className={cn(
          "text-nav font-semibold text-brand-obsidian md:absolute md:top-full md:left-0 md:mt-3",
          !message && "sr-only",
        )}
      >
        {message}
      </p>
    </form>
  );
}
