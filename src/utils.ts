import * as os from 'os'
import * as toolCache from '@actions/tool-cache'

export function getExecutableExtension(): string {
  if (os.type().match(/^Win/)) {
    return '.exe'
  }
  return ''
}

export function getBashExtension(): string {
  if (os.type().match(/^Win/)) {
    return '.bat'
  }
  return '.sh'
}

export function getArchivedExtension(): string {
  if (os.type().match(/^Win/)) {
    return '.zip'
  }
  return '.tar.gz'
}

export function getOsType(): string {
  if (os.type().match(/^Win/)) {
    // Windows_NT
    return 'windows'
  }
  return os.type().toLocaleLowerCase()
}

export async function downloadCache(
  downloadUrl: string,
  name: string,
  version: string,
  fullName: string
): Promise<string> {
  let cachePath = toolCache.find(name, version)
  if (!cachePath) {
    try {
      cachePath = await toolCache.downloadTool(downloadUrl)
    } catch (exception) {
      throw new Error('DownloadFailed')
    }
    await toolCache.cacheFile(cachePath, fullName, name, version)
  }
  return cachePath
}
