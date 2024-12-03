//@ts-check

import page from 'page'
import { forget } from 'remember'

import { getOAuthServiceAPI } from '../oauth-services-api/index.js'
import store from '../store.js'
import { logMessage } from '../utils.js'
import { OAUTH_PROVIDER_STORAGE_KEY } from '../config.js'

/** @import {ScribouilliGitUser} from '../types.js' */

const logout = () => {
  forget(OAUTH_PROVIDER_STORAGE_KEY)
  store.mutations.logout()
  console.info('[logout] redirecting to /login')
  page('/login')
}

/**
 * @summary Fetch the current authenticated user login and set it in the store.
 *
 * @description This function is called on every page that needs authentication.
 * It returns the login of the user or the organization. If the user is not
 * logged in, it redirects to the authentication page.
 *
 * @returns {Promise<ScribouilliGitUser>} A promise that resolves to the login of the
 * authenticated user or organization.
 *
 */
export const fetchAuthenticatedUserLogin = () => {
  const loginP = getOAuthServiceAPI()
    .getAuthenticatedUser()
    .then(({ login = '' }) => {
      if (login === '') {
        throw new Error('NO_LOGIN')
      }

      store.mutations.setLogin(login)

      return login
    })
    // @ts-ignore
    .catch(errorMessage => {
      switch (errorMessage) {
        case 'INVALIDATE_TOKEN':
        case 'NO_LOGIN': {
          logout();
          break;
        }

        default:
          const message = `The access token is invalid. ${errorMessage}`

          logMessage(message, 'fetchAuthenticatedUserLogin')
      }

      throw errorMessage
    })

  const emailP = getOAuthServiceAPI()
    .getUserEmails()
    // @ts-ignore
    .then(emails => {
      // @ts-ignore
      const email = (emails.find(e => e.primary) ?? emails[0]).email
      store.mutations.setEmail(email)
      return email
    })
    // @ts-ignore
    .catch(err => {
      // If we can't get email addresses, we ask the user to login again
      logout()
      throw err
    })

  store.mutations.setLogin(loginP)

  return Promise.all([loginP, emailP]).then(([login, email]) => ({
    login,
    email,
  }))
}

/**
 * @summary Fetch the list of repositories for the current user
 * and set it in the store.
 *
 * @description This function is called on every page that needs the list of
 * repositories for the current user. It returns a promise that resolves to the
 * list of repositories. If the user is not logged in, it redirects to the
 * authentication page.
 *
 * @returns A promise that resolves to the list of
 * repositories for the current user.
 *
 */

export const fetchCurrentUserRepositories = async () => {
  const { login } = await fetchAuthenticatedUserLogin()
  const currentUserRepositoriesP = getOAuthServiceAPI()
    .getCurrentUserRepositories()
    // @ts-ignore
    .then(repos => {
      store.mutations.setReposForAccount({ login, repos })

      return repos
    })

  return currentUserRepositoriesP
}

/**
 *
 * @param {import('./../store.js').ResolutionOption['resolution']} resolution
 * @returns {import('./../store.js').ResolutionOption['resolution']}
 */
export function addConflictRemovalAndRedirectToResolution(resolution) {
  return function (/** @type {any} */ ...args) {
    return resolution(...args).then(() => {
      store.mutations.setConflict(undefined)
      history.back()
    })
  }
}
