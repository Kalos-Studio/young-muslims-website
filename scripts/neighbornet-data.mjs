export const sisterLocationsUrl = "https://ymsisters.com/locations/";

export const stateCodes = {
  Arizona: "AZ",
  California: "CA",
  Connecticut: "CT",
  Florida: "FL",
  Georgia: "GA",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Minnesota: "MN",
  Nevada: "NV",
  "New Jersey": "NJ",
  "New York": "NY",
  "North Carolina": "NC",
  Ohio: "OH",
  Oklahoma: "OK",
  Pennsylvania: "PA",
  Tennessee: "TN",
  Texas: "TX",
  Virginia: "VA",
  Washington: "WA",
  "Washington, DC": "DC",
};

export const brotherRegionStates = {
  "Central/South Virginia": "VA",
  Chicago: "IL",
  Connecticut: "CT",
  "Dallas East": "TX",
  "Dallas West": "TX",
  Florida: "FL",
  Georgia: "GA",
  Houston: "TX",
  Kentucky: "KY",
  Maryland: "MD",
  Massachusetts: "MA",
  Minnesota: "MN",
  "New Jersey Central": "NJ",
  "New Jersey North": "NJ",
  "New Jersey South": "NJ",
  "New York East": "NY",
  "New York West": "NY",
  "Northern Virginia": "VA",
};

export function normalizeName(value) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function slug(value) {
  return normalizeName(value).replace(/\s+/g, "-");
}

export function csvCell(value) {
  const string = String(value ?? "");
  return /[",\n\r]/.test(string) ? `"${string.replaceAll('"', '""')}"` : string;
}

export function toCsv(columns, rows) {
  return `${[
    columns,
    ...rows.map((row) => columns.map((column) => row[column])),
  ]
    .map((row) => row.map(csvCell).join(","))
    .join("\n")}\n`;
}
