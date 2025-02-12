import page from 'page'
import store from '../store.js'
import GitHubAPI from './github.js'
import GitlabAPI from './gitlab.js'

/**
 * @overlaod
 * @param {'github'} type
 * @param {GithubOptions} options
 *
 * @returns {OAuthServiceAPI}
 */

/**
 * @overlaod
 * @param {'gitlab'} type
 * @param {GitlabOptions} options
 *
 * @returns {OAuthServiceAPI}
 */

/**
 * @param {import('./../store.js').OAuthProvider} _
 *
 * @returns {OAuthServiceAPI}
 */
const makeOAuthServiceAPI = ({ accessToken, origin }) => {
  const hostname = new URL(origin).hostname

  if (hostname === 'github.com') return new GitHubAPI(accessToken)
  else {
    // assuming a gitlab instance
    return new GitlabAPI(accessToken, origin, () => {
      if (!store.state.gitAgent) {
        throw new TypeError('store.state.gitAgent is undefined')
      }
      return store.state.gitAgent
    })
  }
}

/** @type {OAuthServiceAPI} */
let oAuthServiceAPI

/**
 * @returns {OAuthServiceAPI}
 */
export const getOAuthServiceAPI = () => {
  // @ts-ignore
  if (oAuthServiceAPI) {
    return oAuthServiceAPI
  }

  const oAuthProvider = store.state.oAuthProvider

  if (!oAuthProvider) {
    console.info("L'utilisateur n'est pas connecté. Redirection vers /")

    page('/')

    throw new TypeError('Missing accessToken or provider name')
  }

  oAuthServiceAPI = makeOAuthServiceAPI(oAuthProvider)

  return oAuthServiceAPI
}
