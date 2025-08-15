import * as util from 'util'
import * as exec from '@actions/exec'
import * as toolCache from '@actions/tool-cache'
import { getBashExtension, downloadCache, getArchivedExtension } from './utils'

const name = 'sshd'
const defaultVersion = '2.5.1'
const fileSufix = getArchivedExtension()
const downloadUrlScheme = 'https://archive.apache.org/dist/mina/sshd/%s/%s%s'

function getFullName(version: string): string {
  return util.format('apache-sshd-%s', version)
}

async function getExecPath(version: string): Promise<string> {
  const downloadUrl = util.format(
    downloadUrlScheme,
    version,
    getFullName(version),
    fileSufix
  )
  const localPath = await downloadCache(
    downloadUrl,
    name,
    version,
    getFullName(version) + fileSufix
  )
  const execPath = await toolCache.extractTar(localPath)
  return execPath
}

export async function sshd(): Promise<string> {
  const version = defaultVersion
  const execPath = await getExecPath(version)
  const cmdList = [
    util.format(
      '%s/%s/bin/%s',
      execPath,
      getFullName(version),
      name + getBashExtension()
    )
  ]
  return new Promise(resolve => {
    ; (async function () {
      for (const item of cmdList) {
        await exec.exec(item)
      }
    })()
    setTimeout(() => resolve('exec done!'), 1000)
  })
}
