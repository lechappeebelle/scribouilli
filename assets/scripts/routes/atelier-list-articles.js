// @ts-check

import AtelierArticles from '../components/screens/AtelierArticles.svelte'
import { svelteTarget } from '../config'
import { replaceComponent } from '../routeComponentLifeCycle'
import store from '../store'
import {
  getCurrentRepoArticles,
  setCurrentRepositoryFromQuerystring,
} from '../actions/current-repository.js'
import { showArticles } from '../actions/article'

/**
 *
 * @param {import('../store').ScribouilliState} state
 * @returns
 */
function mapStateToProps(state) {
  if (!state.currentRepository) {
    throw new TypeError('currentRepository is undefined')
  }

  return {
    articles: state.articles,
    buildStatus: state.buildStatus,
    currentRepository: state.currentRepository,
    showArticles: showArticles(state),
    conflict: state.conflict,
  }
}

/**
 * @param {import('page').Context} _
 */
export default async ({ querystring }) => {
  await setCurrentRepositoryFromQuerystring(querystring)

  const state = store.state
  const atelierArticles = new AtelierArticles({
    target: svelteTarget,
    props: mapStateToProps(state),
  })

  getCurrentRepoArticles()

  replaceComponent(atelierArticles, mapStateToProps)
}

/**
 *
 * @param {ScribouilliGitRepo} scribouilliGitRepo
 * @returns {string}
 */
export function makeAtelierListArticlesURL({ owner, repoName }) {
  return `/atelier-list-articles?account=${owner}&repoName=${repoName}`
}
