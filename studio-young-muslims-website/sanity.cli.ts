import {defineCliConfig} from 'sanity/cli'
import {projectId, dataset} from './env'

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  deployment: {
    appId: process.env.SANITY_STUDIO_APP_ID,
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
