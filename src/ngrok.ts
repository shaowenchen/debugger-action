import * as util from 'util'
import * as exec from '@actions/exec'
import * as core from '@actions/core'
import * as toolCache from '@actions/tool-cache'
import {downloadCache, getOsType} from './utils'
import YAML from 'yaml'
import {writeFile} from 'fs'
import {promisify} from 'util'

const writeFileAsync = promisify(writeFile)

const name = 'ngrok'
const defaultVersion = 'bNyj1mQVY4c'
const fileSufix = '.zip'
const downloadUrlScheme = 'https://bin.equinox.io/c/%s/%s%s'

function getFullName(): string {
  return util.format('ngrok-stable-%s-amd64', getOsType())
}

async function writeTunnel(path: string, token: string): Promise<string> {
  const config = Object()
  config['authtoken'] = token
  config['tunnels'] = {
    'tcp-8000': {
      addr: '8000',
      proto: 'tcp'
    }
  }
  const addr_1: string = core.getInput('ngrok_addr_1')
  const proto_1: string = core.getInput('ngrok_proto_1')
  const addr_2: string = core.getInput('ngrok_addr_2')
  const proto_2: string = core.getInput('ngrok_proto_2')
  const addr_3: string = core.getInput('ngrok_addr_3')
  const proto_3: string = core.getInput('ngrok_proto_3')
  if (addr_1 !== '' && proto_1 !== '') {
    const key_1 = util.format('%s-%s', proto_1, addr_1)
    config['tunnels'][key_1] = {
      addr: addr_1,
      proto: proto_1
    }
  }
  if (addr_2 !== '' && proto_2 !== '') {
    const key_2 = util.format('%s-%s', proto_2, addr_2)
    config['tunnels'][key_2] = {
      addr: addr_2,
      proto: proto_2
    }
  }
  if (addr_3 !== '' && proto_3 !== '') {
    const key_3 = util.format('%s-%s', proto_3, addr_3)
    config['tunnels'][key_3] = {
      addr: addr_3,
      proto: proto_3
    }
  }
  await writeFileAsync(path, YAML.stringify(config))
  return path
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
  const cfgFile = util.format('%s/ngrok.cfg', execPath)
  writeTunnel(cfgFile, NGROK_TOKEN)
  const cmdList = [
    util.format('chmod +x %s/ngrok', execPath),
    util.format(
      '%s/ngrok  start --all --config  %s --log "stdout"',
      execPath,
      cfgFile
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
