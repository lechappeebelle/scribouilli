//@ts-check

import GitAgent from '../GitAgent.js'
import store from './../store.js'

/**
 * @param {string} fileName
 * @param {string|Uint8Array} content
 * @param {string} [commitMessage]
 *
 * @returns {Promise<string>}
 */
export const writeFileAndCommit = (fileName, content, commitMessage) => {
  if (typeof commitMessage !== 'string' || commitMessage === '') {
    commitMessage = `Modification du fichier ${fileName}`
  }
  const { gitAgent } = store.state

  if (!gitAgent) {
    throw new TypeError('gitAgent is undefined')
  }

  return gitAgent.writeFile(fileName, content).then(() => {
    // @ts-ignore
    return gitAgent.commit(commitMessage)
  })
}

/**
 * @param {string} fileName
 * @param {string|Uint8Array} content
 * @param {string} [commitMessage]
 *
 * @returns {ReturnType<typeof GitAgent.prototype.safePush>}
 */
export const writeFileAndPushChanges = (
  fileName,
  content,
  commitMessage = '',
) => {
  const { gitAgent } = store.state

  if (!gitAgent) {
    throw new TypeError('gitAgent is undefined')
  }

  return writeFileAndCommit(fileName, content, commitMessage).then(() =>
    gitAgent.safePush(),
  )
}

/**
 * @param {string} fileName
 * @param {string} [commitMessage]
 *
 * @returns {ReturnType<typeof GitAgent.prototype.commit>}
 */
export const deleteFileAndCommit = (fileName, commitMessage = '') => {
  const { gitAgent } = store.state

  if (!gitAgent) {
    throw new TypeError('gitAgent is undefined')
  }

  if (commitMessage === '') {
    commitMessage = `Suppression du fichier ${fileName}`
  }

  return gitAgent.removeFile(fileName).then(() => {
    return gitAgent.commit(commitMessage)
  })
}

/**
 * @param {string} fileName
 * @param {string} [commitMessage]
 *
 * @returns {ReturnType<typeof GitAgent.prototype.safePush>}
 */
export const deleteFileAndPushChanges = (fileName, commitMessage) => {
  const { gitAgent } = store.state

  if (!gitAgent) {
    throw new TypeError('gitAgent is undefined')
  }

  return deleteFileAndCommit(fileName, commitMessage).then(() =>
    gitAgent.safePush(),
  )
}

export const file = {
  deleteFileAndPushChanges,
  deleteFileAndCommit,
  writeFileAndCommit,
  writeFileAndPushChanges,
}
