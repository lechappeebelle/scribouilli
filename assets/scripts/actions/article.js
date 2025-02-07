//@ts-check

import lireFrontMatter from 'front-matter'

import store from './../store.js'
import { deleteFileAndPushChanges, writeFileAndPushChanges } from './file.js'
import { keepMarkdownAndHTMLFiles } from './page.js'
import { makeArticleFileName, makeArticleFrontMatter } from './../utils.js'

/** Helper to know whether to show articles in the menu or not.
 *
 * Articles are shown if the blog is enabled and there are some articles.
 *
 * QUESTION: The documentation above is what I assumed by reading the code but
 * it seems weird to me that the articles will not be shown in the menu if there
 * are none (you wouldn't be able to create a new one then). So either fix the docs
 * or the code.
 *
 * @param {import("../store.js").ScribouilliState} state
 */
export const showArticles = state =>
  hasBlog(state) && state.articles && state.articles.length > 0

/** Return whether the blog is enabled or not.
 *
 * @param {import("../store.js").ScribouilliState} state
 */
function hasBlog(state) {
  const index = blogIndex(state)
  return index !== undefined
}

/**
 * Return the file path of the blog index if it is enabled.
 *
 * It is true iff there is a file in the root of the project that has `blogIndex: true`
 * in its front-matter.
 *
 * @param {import("../store.js").ScribouilliState} state
 * @returns {string | undefined}
 */
export function blogIndex(state) {
  const pages = state.pages ?? []
  return pages.find(p => p.blogIndex ?? false)?.path
}

/**
 *
 * @returns {Promise<Article[]>}
 */
export async function getArticlesList() {
  const { gitAgent } = store.state

  if (!gitAgent) {
    throw new TypeError('gitAgent is undefined')
  }

  const ARTICLES_DIRECTORY = '_posts'

  const allFiles = await gitAgent.listFiles(ARTICLES_DIRECTORY)

  return Promise.all(
    allFiles.filter(keepMarkdownAndHTMLFiles).map(async filename => {
      const fullName = `${ARTICLES_DIRECTORY}/${filename}`
      const content = await gitAgent.getFile(fullName)
      const { attributes: data, body: markdownContent } = lireFrontMatter(
        content.toString(),
      )
      return {
        title: data?.title,
        path: fullName,
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
export const deleteArticle = fileName => {
  const { state } = store

  store.mutations.setArticles(
    (state.articles ?? []).filter(article => {
      return article.path !== fileName
    }),
  )

  return deleteFileAndPushChanges(
    fileName,
    `Suppression de l'article ${fileName}`,
  )
}

/**
 * @param {string} title
 * @param {string} content
 *
 * @returns {ReturnType<typeof writeFileAndPushChanges>}
 */
export const createArticle = (title, content) => {
  const { state } = store

  const date = new Date()
  const targetFileName = makeArticleFileName(title, date)

  let newArticles =
    state.articles?.filter(article => {
      return article.path !== targetFileName
    }) || []
  newArticles.push({ title: title, path: targetFileName })

  store.mutations.setArticles(newArticles)

  const finalContent = `${
    title ? makeArticleFrontMatter(title) + '\n' : ''
  }${content}`

  return writeFileAndPushChanges(
    targetFileName,
    finalContent,
    `Création de l'article : ${title}`,
  )
}

/**
 * @param {string} fileName
 * @param {string} content
 * @param {string} title
 *
 * @returns {ReturnType<typeof writeFileAndPushChanges>}
 */
export const updateArticle = async (fileName, title, content) => {
  const { gitAgent } = store.state

  if (!gitAgent) {
    throw new TypeError('gitAgent is undefined')
  }

  const existingDate = fileName.slice(
    '_posts/'.length,
    '_posts/YYYY-MM-DD'.length,
  )
  const date = new Date(existingDate)

  const targetFileName = makeArticleFileName(title, date)

  // If the title has changed, we need to delete the old article and
  // create a new one because the file name has changed.
  if (fileName && fileName !== targetFileName) {
    await gitAgent.removeFile(fileName)
  }

  const finalContent = `${
    title ? makeArticleFrontMatter(title) + '\n' : ''
  }${content}`

  return writeFileAndPushChanges(
    targetFileName,
    finalContent,
    `Modification de l'article : ${title}`,
  )
}
