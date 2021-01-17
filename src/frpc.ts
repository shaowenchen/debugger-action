import * as util from 'util'
import * as exec from '@actions/exec'
import {writeFile} from 'fs'
import * as toolCache from '@actions/tool-cache'
import {promisify} from 'util'
import ini from 'ini'
import {getOsType, getArchivedExtension, downloadCache} from './utils'

const writeFileAsync = promisify(writeFile)

const name = 'frpc'
const defaultVersion = '0.34.3'
const fileSufix = getArchivedExtension()
const downloadUrlScheme =
  'https://github.com/fatedier/frp/releases/download/v%s/%s%s'

function getFullName(version: string): string {
  return util.format('frp_%s_%s_amd64', version, getOsType())
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

async function writeInit(
  path: string,
  frp_server_addr: string,
  frp_server_port: string,
  frp_token: string,
  ssh_port: string
): Promise<string> {
  const config = {
    common: {
      server_addr: frp_server_addr,
      server_port: frp_server_port,
      token: frp_token
    },
    ssh: {
      type: 'tcp',
      local_ip: '127.0.0.1',
      local_port: 8000,
      remote_port: ssh_port
    }
  }
  await writeFileAsync(path, ini.stringify(config))
  return path
}

export async function frp(
  frp_server_addr: string,
  frp_server_port: string,
  frp_token: string,
  ssh_port: string
): Promise<string> {
  const version = defaultVersion
  const execPath = await getExecPath(version)
  const initFile = util.format('%s/%s/my.ini', execPath, getFullName(version))
  await writeInit(
    initFile,
    frp_server_addr,
    frp_server_port,
    frp_token,
    ssh_port
  )
  const cmdList = [
    util.format(
      '%s/%s/%s -c %s',
      execPath,
      getFullName(version),
      name,
      initFile
    )
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
