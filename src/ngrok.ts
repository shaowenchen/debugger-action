import * as util from 'util'
import * as exec from '@actions/exec'
import * as toolCache from '@actions/tool-cache'
import {downloadCache, getOsType} from './utils'

const name = 'ngrok'
const defaultVersion = '4VmDzA7iaHb'
const fileSufix = '.zip'
const downloadUrlScheme = 'https://bin.equinox.io/c/%s/%s%s'

function getFullName(): string {
  return util.format('ngrok-stable-%s-amd64', getOsType())
}

async function getExecPath(version: string): Promise<string> {
  const downloadUrl = util.format(
    downloadUrlScheme,
    version,
    getFullName(),
    fileSufix
  )
  const localPath = await downloadCache(
    downloadUrl,
    name,
    version,
    getFullName() + fileSufix
  )
  const execPath = await toolCache.extractZip(localPath)
  return execPath
}

export async function ngrok(NGROK_TOKEN: string): Promise<string> {
  const version = defaultVersion
  const execPath = await getExecPath(version)
  const cmdList = [
    util.format('rm -f %s/.ngrok.log', execPath),
    util.format('%s/ngrok authtoken "%s"', execPath, NGROK_TOKEN),
    util.format('chmod +x %s/ngrok', execPath),
    util.format('%s/ngrok tcp 8000 --log=stdout --log-level=info', execPath)
  ]
  return new Promise(resolve => {
    ;(async function () {
      for (const item of cmdList) {
        await exec.exec(item)
      }
    })()
    setTimeout(() => resolve('exec done!'), 1000)
  })
}
