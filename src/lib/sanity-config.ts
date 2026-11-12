function required(value: string | undefined, name: string) {
  if (!value) throw new Error(`Missing ${name}. Set it in your environment.`);
  return value;
}

export const sanityProjectId = required(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
);
export const sanityDataset = required(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "NEXT_PUBLIC_SANITY_DATASET",
);
