import { getDeploymentConfig } from '../site.config.mjs'

export function deploymentConfigFromArgs(args = process.argv.slice(2), environment = process.env) {
  const values = { ...environment }

  for (let index = 0; index < args.length; index += 1) {
    const flag = args[index]
    const value = args[index + 1]
    if ((flag === '--base-path' || flag === '--site-origin') && !value) {
      throw new Error(`${flag} 需要一个值`)
    }
    if (flag === '--base-path') values.NEXT_PUBLIC_BASE_PATH = value
    if (flag === '--site-origin') values.NEXT_PUBLIC_SITE_ORIGIN = value
  }

  return getDeploymentConfig(values)
}
