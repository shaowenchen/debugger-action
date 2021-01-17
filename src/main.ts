import * as core from '@actions/core'
import {frp} from './frpc'
import {sshd} from './sshd'

async function run(): Promise<void> {
  try {
    const frp_server_addr: string = core.getInput('frp_server_addr')
    const frp_server_port: string = core.getInput('frp_server_port')
    const frp_token: string = core.getInput('frp_token')
    const ssh_port: string = core.getInput('ssh_port')
    await sshd()
    await frp(frp_server_addr, frp_server_port, frp_token, ssh_port)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
