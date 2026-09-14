import { getDeploymentConfig, toSiteUrl } from '../../site.config.mjs'

export const deploymentConfig = getDeploymentConfig()

export function siteUrl(pathname = '/') {
  return toSiteUrl(pathname, deploymentConfig)
}
