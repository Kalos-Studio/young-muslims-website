/**
 * Text as the NeighborNets search compares it (the earlier finder's
 * `normalizeSearchTerm`, kept and extended): accents dropped ("Cañon" ->
 * "canon"), lower case, punctuation as spaces, the common abbreviations
 * folded ("Saint"/"St.", "Mount"/"Mt.", "Fort"/"Ft."), and a leading "The"
 * dropped ("The Bronx"). Shared by the map's search (the browser) and the
 * generator that writes its index (scripts/neighbornets-context.mjs), so a
 * query and the index always agree.
 */
export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLocaleLowerCase("en-US")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/^the /, "")
    .replace(/\bsaint\b/g, "st")
    .replace(/\bmount\b/g, "mt")
    .replace(/\bfort\b/g, "ft")
    .replace(/ +/g, " ");
}

/** The index chunk a normalized place name is in: its first letter. */
export function placeChunkKey(normalized: string): string {
  const first = normalized.charAt(0);
  return /[a-z]/.test(first) ? first : "0";
}
