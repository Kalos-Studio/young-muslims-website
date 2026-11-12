function required(value: string | undefined, name: string) {
  if (!value) throw new Error(`Missing ${name}. Set it in your environment.`)
  return value
}

export const projectId = required(process.env.SANITY_STUDIO_PROJECT_ID, 'SANITY_STUDIO_PROJECT_ID')
export const dataset = required(process.env.SANITY_STUDIO_DATASET, 'SANITY_STUDIO_DATASET')
