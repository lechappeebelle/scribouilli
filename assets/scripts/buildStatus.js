//@ts-check

import GitAgent from './GitAgent.js'

/**
 * @typedef {"in_progress" | "success" | "error"} BuildStatus
 */

/**
 *
 * @param {ScribouilliGitRepo} scribouilliGitRepo
 * @param {GitAgent} gitAgent
 */
export default function (scribouilliGitRepo, gitAgent) {
  /** @type {BuildStatus} */
  let repoStatus = 'in_progress'
  /** @type {(status: BuildStatus) => any} */
  let reaction
  /** @type {ReturnType<setTimeout> | undefined} */
  let timeout

  function scheduleCheck(delay = 5000) {
    if (!timeout) {
      timeout = setTimeout(() => {
        buildStatusObject.checkStatus()
        timeout = undefined
      }, delay)
    }
  }

  const buildStatusObject = {
    get status() {
      return repoStatus
    },
    /**
     *
     * @param {(status: BuildStatus) => any} callback
     */
    subscribe(callback) {
      console.log('subscribe reaction.. ', callback)
      reaction = callback
    },
    checkStatus() {
      return getBuildStatus(scribouilliGitRepo, gitAgent)
        .then(status => {
          repoStatus = status
          if (reaction) {
            reaction(repoStatus)
          }

          if (repoStatus === 'in_progress') {
            scheduleCheck()
          }
        })
        .catch(() => {
          repoStatus = 'error'
          if (reaction) {
            reaction(repoStatus)
          }
        })
    },
    setBuildingAndCheckStatusLater(t = 30000) {
      repoStatus = 'in_progress'
      // @ts-ignore
      clearTimeout(timeout)
      timeout = undefined
      scheduleCheck(t)
    },
  }

  buildStatusObject.checkStatus()
  return buildStatusObject
}

/** Delay (in seconds) after which a non-updated website is assumed to have failed to build. */
const ERROR_DELAY = 60

/**
 * mimoza includes the hash of the latest built commit in a comment in the HTML of each page.
 * We use that to know which version is currently online, and whether the last build succeeded
 * or not.
 *
 * @param {ScribouilliGitRepo} currentRepository
 * @param {GitAgent} gitAgent
 * @returns {Promise<BuildStatus>}
 */
async function getBuildStatus(currentRepository, gitAgent) {
  const publishedWebsiteURL = await currentRepository.publishedWebsiteURL
  const html = await fetch(publishedWebsiteURL).then(r => r.text())
  const dom = new DOMParser().parseFromString(html, 'text/html')

  const lastCommit = await gitAgent.currentCommit()

  for (const node of dom.documentElement.childNodes) {
    if (node.nodeType === dom.COMMENT_NODE) {
      const comment = (node.textContent ?? '').trim()
      if (comment.startsWith('scribouilli-git-hash')) {
        const hash = comment.split(': ').at(1) ?? 'unknown'

        if (hash === 'unknown') {
          throw new Error('Unknown git hash')
        }

        console.log(lastCommit)
        if (hash === lastCommit.oid.slice(0, 7)) {
          return 'success'
        } else {
          const currentTime = new Date().getTime() / 1000
          const deltaTime = currentTime - lastCommit.committer.timestamp
          if (deltaTime > ERROR_DELAY) {
            return 'error'
          } else {
            return 'in_progress'
          }
        }
      }
    }
  }

  throw new Error('Git hash comment not found')
}
