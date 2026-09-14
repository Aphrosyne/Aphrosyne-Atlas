import { spawn } from 'node:child_process'
import { deploymentConfigFromArgs } from './static-args.mjs'

const config = deploymentConfigFromArgs()
const npmCommand = process.platform === 'win32' ? process.execPath : 'npm'
const npmArguments = process.platform === 'win32'
  ? [process.env.npm_execpath, 'run', 'build']
  : ['run', 'build']

if (process.platform === 'win32' && !process.env.npm_execpath) {
  throw new Error('无法定位 npm CLI；请从 npm script 运行 build:static。')
}

const child = spawn(npmCommand, npmArguments, {
  stdio: 'inherit',
  env: {
    ...process.env,
    NEXT_PUBLIC_BASE_PATH: config.basePath,
    NEXT_PUBLIC_SITE_ORIGIN: config.siteOrigin,
  },
})

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal)
  process.exitCode = code ?? 1
})
