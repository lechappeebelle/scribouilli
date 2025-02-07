// @ts-check

import store from '../store.js'

import ResolutionDesynchronisation from '../components/screens/ResolutionDesynchronisation.svelte'

import { svelteTarget } from '../config.js'
import { replaceComponent } from '../routeComponentLifeCycle.js'
import { setCurrentRepositoryFromQuerystring } from '../actions/current-repository.js'
import { showArticles } from '../actions/article.js'

/**
 *
 * @param {import('../store.js').ScribouilliState} state
 * @returns
 */
const mapStateToProps = state => {
  const { conflict, currentRepository, buildStatus } = state

  return {
    conflict,
    currentRepository,
    showArticles: showArticles(state),
    buildStatus,
  }
}

/**
 * @param {import('page').Context} _
 */
export default async ({ querystring }) => {
  await setCurrentRepositoryFromQuerystring(querystring)

  const conflictResolution = new ResolutionDesynchronisation({
    target: svelteTarget,
    props: mapStateToProps(store.state),
  })

  replaceComponent(conflictResolution, mapStateToProps)
}
