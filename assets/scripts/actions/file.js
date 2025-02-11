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
export const writeFileAndCommit = async (
  fileName,
  content,
  commitMessage,
  localStore = store,
) => {
  if (typeof commitMessage !== 'string' || commitMessage === '') {
    commitMessage = `Modification du fichier ${fileName}`
  }
  const { gitAgent } = localStore.state

  if (!gitAgent) {
    throw new TypeError('gitAgent is undefined')
  }

  await gitAgent.writeFile(fileName, content)
  return gitAgent.commit(commitMessage)
}

/**
 * @param {string} fileName
 * @param {string|Uint8Array} content
 * @param {string} [commitMessage]
 *
 * @returns {ReturnType<typeof GitAgent.prototype.safePush>}
 */
export const writeFileAndPushChanges = async (
  fileName,
  content,
  commitMessage = '',
  localStore = store,
) => {
  const { gitAgent } = localStore.state

  if (!gitAgent) {
    throw new TypeError('gitAgent is undefined')
  }

  await writeFileAndCommit(fileName, content, commitMessage)
  return gitAgent.safePush()
}

/**
 * @param {string} fileName
 * @param {string} [commitMessage]
 *
 * @returns {ReturnType<typeof GitAgent.prototype.commit>}
 */
export const deleteFileAndCommit = async (
  fileName,
  commitMessage = '',
  localStore = store,
) => {
  const { gitAgent } = localStore.state

  if (!gitAgent) {
    throw new TypeError('gitAgent is undefined')
  }

  if (commitMessage === '') {
    commitMessage = `Suppression du fichier ${fileName}`
  }

  await gitAgent.removeFile(fileName)
  return gitAgent.commit(commitMessage)
}

/**
 * @param {string} fileName
 * @param {string} [commitMessage]
 *
 * @returns {ReturnType<typeof GitAgent.prototype.safePush>}
 */
export const deleteFileAndPushChanges = (
  fileName,
  commitMessage,
  localStore = store,
) => {
  const { gitAgent } = localStore.state

  if (!gitAgent) {
    throw new TypeError('gitAgent is undefined')
  }

  deleteFileAndCommit(fileName, commitMessage, localStore)
  return gitAgent.safePush()
}

export const file = {
  deleteFileAndPushChanges,
  deleteFileAndCommit,
  writeFileAndCommit,
  writeFileAndPushChanges,
}
