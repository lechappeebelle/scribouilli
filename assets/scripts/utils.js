//@ts-check

import page from 'page'
import { format } from 'date-fns'

import store from './store.js'

/**
 * @summary Handle errors catched by Promises
 * @param {string} errorMessage
 */
export const handleErrors = errorMessage => {
  switch (errorMessage) {
    case 'INVALIDATE_TOKEN': {
      store.mutations.logout()
      console.info('[invalid token] redirecting to /')
      page('/')

      break
    }
    case 'REPOSITORY_NOT_FOUND': {
      console.info(
        '[REPOSITORY_NOT_FOUND] redirecting to /selectionner-un-site',
      )
      page('/selectionner-un-site')

      break
    }
    case 'NOT_FOUND':
      const message = `gitAgent call failed: ${errorMessage}`
      logMessage(message, 'handleErrors')

      break

    default:
      logMessage(errorMessage, 'handleErrors')
      throw errorMessage
  }
}

/**
 *
 * @param {string} string
 * @returns {string}
 */
function makeFilenameCompatibleString(string) {
  return string
    .replace(/\/|#|\?|:|&|\(|\)/g, '-') // replace url confusing characters
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accent because GH pages triggers file download
    .split('.')
    .join('') // Remove dot to avoid issues
    .toLowerCase()
}

/**
 *
 * @param {string} title
 * @returns {string}
 */
export function makeFileNameFromTitle(title) {
  return makeFilenameCompatibleString(title) + '.md'
}

/**
 *
 * @param {string} title
 * @param {Date} date
 * @returns {string}
 */
export function makeArticleFileName(title, date) {
  return `_posts/${format(date, 'yyyy-MM-dd')}-${makeFilenameCompatibleString(
    title,
  )}.md`
}

/**
 *
 * @param {string} title
 * @param {number?} index
 * @param {boolean} inMenu
 * @param {boolean} [blogIndex]
 * @returns {string}
 */
export function makePageFrontMatter(
  title,
  index = 1,
  inMenu = true,
  blogIndex = undefined,
) {
  return [
    '---',
    'title: ' + '"' + title.replace(/"/g, '\\"') + '"',
    'order: ' + index,
    'in_menu: ' + inMenu,
  ]
    .concat(blogIndex ? ['blog_index: true'] : [])
    .concat(['---'])
    .join('\n')
}

/**
 *
 * @param {string} title
 * @returns {string}
 */
export function makeArticleFrontMatter(title) {
  return [
    '---',
    'title: ' + '"' + title.replace(/"/g, '\\"') + '"',
    '---',
  ].join('\n')
}

/**
 *
 * @param {string} errorMessage
 * @param {string} caller
 * @param {'log' | 'warn' | 'error'} level
 */
export const logMessage = (errorMessage, caller = 'unknown', level = 'log') => {
  console[level](`[${level}] [caller: ${caller}] ${errorMessage}`)
}

/**
 *
 * @param {number} ms
 * @returns {Promise<void>}
 */
export const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

/**
 *
 * @param {any} lastCommit
 * @returns {boolean}
 */
export const isItStillCompiling = lastCommit => {
  // Delay (in seconds) after which a non-updated website is assumed to have failed to build.
  const ERROR_DELAY = 60 * 1000
  const currentTime = new Date().getTime() / 1000
  const deltaTime = currentTime - lastCommit.committer.timestamp
  return deltaTime <= ERROR_DELAY
}
