//@ts-check

import GitAgent from './GitAgent.js'
import { getOAuthServiceAPI } from './oauth-services-api/index.js'
import { isItStillCompiling } from './utils.js'

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
      reaction = callback
    },
    checkStatus() {
      return getBuildStatus(scribouilliGitRepo, gitAgent)
        .then(status => {
          repoStatus = status
          if (reaction) {
            reaction(repoStatus)
          }

          if (repoStatus === 'in_progress' || repoStatus === 'not_public') {
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

/**
 * mimoza includes the hash of the latest built commit in a comment in the HTML
 * of each page. We use that to know which version is currently online, and
 * whether the last build succeeded or not.
 *
 * @param {ScribouilliGitRepo} currentRepository
 * @param {GitAgent} gitAgent
 * @returns {Promise<BuildStatus>}
 */
async function getBuildStatus(currentRepository, gitAgent) {
  const publishedWebsiteURL = await currentRepository.publishedWebsiteURL
  let html
  try {
    const req = await fetch(publishedWebsiteURL, {
      cache: 'no-store',
    })

    const url = new URL(req.url)
    if (req.redirected && url.hostname.endsWith('projects.gitlab.io')) {
      // If the website is a "private" GitLab repo, we will receive a redirection to
      // GitLab to login, which will fail because of CORS. In case it doesn't fail,
      // the Error we throw above should still catch this redirection.
      return 'not_public'
    }

    html = await req.text()
  } catch {
    // If the website is a "private" GitLab repo, we will receive a redirection to
    // GitLab to login, which will fail because of CORS. In case it doesn't fail,
    // the Error we throw above should still catch this redirection.
    return 'not_public'
  }

  const dom = new DOMParser().parseFromString(html, 'text/html')

  const lastCommit = await gitAgent.currentCommit()

  for (const node of dom.documentElement.childNodes) {
    if (node.nodeType === dom.COMMENT_NODE) {
      const comment = (node.textContent ?? '').trim()
      if (comment.startsWith('scribouilli-git-hash')) {
        const hash = comment.split(': ').at(1) ?? 'unknown'

        if (hash === 'unknown') {
          // For some reason, the jekyll-git-hash plugin didn't work or was not
          // correctly installed (this can happen with old Scribouilli websites
          // that didn't use a Gemfile).
          //
          // In that case, fallback to the GitHub/GitLab API.
          return await getViaApi(currentRepository)
        }

        if (hash === lastCommit.oid.slice(0, 7)) {
          return 'success'
        } else {
          if (isItStillCompiling(lastCommit)) {
            return 'in_progress'
          } else {
            return 'error'
          }
        }
      }
    }
  }

  // If there is no comment at all, we know that the website was built using an
  // old Scribouilli version: no changes were made since then, so we can assume
  // that the last build was successfull.
  return 'success'
}

/**
 * @param {ScribouilliGitRepo} scribouilliGitRepo
 */
function getViaApi(scribouilliGitRepo) {
  return getOAuthServiceAPI().getPagesWebsiteDeploymentStatus(
    scribouilliGitRepo,
  )
}
