//@ts-check

import lireFrontMatter from 'front-matter'

import store from './../store.js'
import { makeFileNameFromTitle, makePageFrontMatter } from './../utils.js'
import { deleteFileAndPushChanges, writeFileAndPushChanges } from './file.js'

/**
 *
 * @param {string} filename
 * @returns {boolean}
 */
export function keepMarkdownAndHTMLFiles(filename) {
  return filename.endsWith('.md') || filename.endsWith('.html')
}

/**
 *
 * @returns {Promise<Page[]>}
 */
export async function getPagesList() {
  const { gitAgent } = store.state

  if (!gitAgent) {
    throw new TypeError('gitAgent is undefined')
  }

  const allFiles = await gitAgent.listFiles('')

  return Promise.all(
    allFiles.filter(keepMarkdownAndHTMLFiles).map(async filename => {
      const content = await gitAgent.getFile(filename)
      const { attributes: data, body: markdownContent } = lireFrontMatter(
        content.toString(),
      )

      return {
        title: data?.title,
        index: data?.order,
        // no `in_menu` proprerty is interpreted as the page should be in the menu
        inMenu: data?.in_menu === true || data?.in_menu === undefined,
        blogIndex: data?.blog_index === true,
        path: filename,
        content: markdownContent,
      }
    }),
  )
}

/**
 * @param {string} fileName
 *
 * @returns {ReturnType<typeof deleteFileAndPushChanges>}
 */
export const deletePage = fileName => {
  const { state } = store

  store.mutations.setPages(
    state.pages &&
      state.pages.filter(page => {
        return page.path !== fileName
      }),
  )

  return deleteFileAndPushChanges(
    fileName,
    `Suppression de la page ${fileName}`,
  )
}

/**
 * @param {string} content
 * @param {string} title
 * @param {number} index
 *
 * @returns {ReturnType<typeof writeFileAndPushChanges>}
 */
export const createPage = (content, title, index) => {
  const { state } = store
  const fileName = makeFileNameFromTitle(title)

  let newPages =
    state.pages?.filter(page => {
      return page.path !== fileName
    }) || []
  newPages.push({ title: title, path: fileName, index })

  store.mutations.setPages(newPages)

  const finalContent = `${
    title ? makePageFrontMatter(title, index) + '\n' : ''
  }${content} `

  return writeFileAndPushChanges(
    fileName,
    finalContent,
    `Création de la page : ${title}`,
  )
}

/**
 * @param {string} fileName
 * @param {string} content
 * @param {string} title
 * @param {number} index
 * @param {boolean} blogIndex
 *
 * @returns {ReturnType<typeof writeFileAndPushChanges>}
 */
export const updatePage = async (
  fileName,
  title,
  content,
  index,
  blogIndex,
) => {
  const { gitAgent } = store.state

  if (!gitAgent) {
    throw new TypeError('gitAgent is undefined')
  }
  let targetFileName = fileName

  if (fileName !== 'index.md') {
    targetFileName = makeFileNameFromTitle(title)
  }

  // If the title has changed, we need to delete the old page and
  // create a new one because the file name has changed.
  if (fileName && fileName !== targetFileName) {
    await gitAgent.removeFile(fileName)
  }

  const finalContent = `${
    title ? makePageFrontMatter(title, index, undefined, blogIndex) + '\n' : ''
  }${content} `

  return writeFileAndPushChanges(
    targetFileName,
    finalContent,
    `Modification de la page : ${title}`,
  )
}
