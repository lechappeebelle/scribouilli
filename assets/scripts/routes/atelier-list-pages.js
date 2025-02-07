// @ts-check

import { svelteTarget } from '../config'
import { replaceComponent } from '../routeComponentLifeCycle'
import store from '../store'
import { setCurrentRepositoryFromQuerystring } from '../actions/current-repository.js'
import AtelierPages from '../components/screens/AtelierPages.svelte'
import { showArticles } from '../actions/article'

/**
 *
 * @param {import("../store").ScribouilliState} state
 * @returns
 */
const mapStateToProps = state => {
  if (!state.currentRepository) {
    throw new TypeError('currentRepository is undefined')
  }

  return {
    pages: state.pages,
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
  const atelierPages = new AtelierPages({
    target: svelteTarget,
    props: mapStateToProps(state),
  })

  replaceComponent(atelierPages, mapStateToProps)
}
