import { gitHubApiBaseUrl } from './../config.js'

import './../types.js'

const GITHUB_JSON_ACCEPT_HEADER = 'application/vnd.github+json'

/**
 * @implements {OAuthServiceAPI}
 */
export default class GitHubAPI {
  /**
   * @param {string} accessToken
   */
  constructor(accessToken) {
    /** @type {string | undefined} */
    this.accessToken = accessToken
  }

  getOauthUsernameAndPassword() {
    if (!this.accessToken) {
      throw new TypeError('Missing accessToken')
    }

    return {
      username: this.accessToken,
      password: 'x-oauth-basic',
    }
  }

  getAuthenticatedUser() {
    return this.callAPI(`${gitHubApiBaseUrl}/user`).then(response => {
      return response.json()
    })
  }

  /** @type {OAuthServiceAPI["getUserEmails"]} */
  getUserEmails() {
    return this.callAPI(`${gitHubApiBaseUrl}/user/emails`).then(response => {
      return response.json()
    })
  }

  /** @type {OAuthServiceAPI["getCurrentUserRepositories"]} */
  getCurrentUserRepositories() {
    return this.callAPI(
      `${gitHubApiBaseUrl}/user/repos?sort=updated&visibility=public`,
    ).then(response => {
      return response.json()
    })
  }

  /** @type {OAuthServiceAPI["createDefaultRepository"]} */
  createDefaultRepository(
    { owner, repoName, publishedWebsiteURL },
    template,
  ) {
    // Generate a new repository from the theme repository
    return this.callAPI(
      `${gitHubApiBaseUrl}/repos/${template.githubRepoId}/generate`,
      {
        headers: {
          Authorization: 'token ' + this.accessToken,
          Accept: GITHUB_JSON_ACCEPT_HEADER,
        },
        method: 'POST',
        body: JSON.stringify({
          owner,
          name: repoName,
          description: 'Mon site Scribouilli',
        }),
      },
    )
    .then(r => r.json())
    .then(({url: newRepoAPIURL, clone_url}) => {
      // Activate GitHub Pages
      return this.callAPI(`${newRepoAPIURL}/pages`, {
        method: 'POST',
        headers: {
          Authorization: 'token ' + this.accessToken,
          Accept: GITHUB_JSON_ACCEPT_HEADER,
        },
        body: JSON.stringify({
          build_type: 'workflow',
        })
      })
      .then(async () => {
        console.info('Setup repository settings')
        // Setup repository settings
        return this.callAPI(newRepoAPIURL, {
          method: 'POST',
          headers: {
            Authorization: 'token ' + this.accessToken,
            Accept: GITHUB_JSON_ACCEPT_HEADER,
          },
          body: JSON.stringify({
            homepage: (await publishedWebsiteURL) || '',
            has_issues: false,
            has_projects: false,
            has_wiki: false,
          }),
        })
      })
      .then(() => {
        console.info('Apply topic to the new repository')
        // Apply topic to the new repository
        return this.callAPI(`${newRepoAPIURL}/topics`, {
          headers: {
            Authorization: 'token ' + this.accessToken,
            Accept: GITHUB_JSON_ACCEPT_HEADER,
          },
          method: 'PUT',
          body: JSON.stringify({
            owner,
            repo: repoName,
            names: ['site-scribouilli'],
          })
        })
      })
      .then(() => ({remoteURL: clone_url}))

    })
  }

  /** @type {OAuthServiceAPI["deploy"]} */
  deploy({ repoId }) {
    return this.callAPI(`${gitHubApiBaseUrl}/repos/${repoId}/dispatches`, {
      method: 'POST',
      headers: {
        Authorization: 'token ' + this.accessToken,
        Accept: GITHUB_JSON_ACCEPT_HEADER,
      },
      body: JSON.stringify({
        event_type: 'atelier-scribouilli',
      }),
    })
  }

  /** @type {OAuthServiceAPI["getPagesWebsiteDeploymentStatus"]} */
  getPagesWebsiteDeploymentStatus({ repoId }) {
    // TODO: We need to add the `sha` parameter to avoid the GitHub API to return
    // cached data.
    return this.callAPI(
      `${gitHubApiBaseUrl}/repos/${repoId}/deployments?environment=github-pages`,
    )
      .then(response => response.json())
      .then(json => {
        const statusesUrl = json[0].statuses_url

        return this.callAPI(`${statusesUrl}?per_page=1`)
      })
      .then(response => response.json())
      .then(json => {
        return json[0].state
      })
  }

  /** @type {OAuthServiceAPI["isPagesWebsiteBuilt"]} */
  isPagesWebsiteBuilt(scribouilliGitRepo) {
    return this.getPagesWebsiteDeploymentStatus(scribouilliGitRepo)
      .then(response => {
        return response === 'success'
      })
      .catch(() => {
        return false
      })
  }

  /** @type {OAuthServiceAPI["isRepositoryReady"]} */
  isRepositoryReady({ repoId }) {
    return this.callAPI(
      `${gitHubApiBaseUrl}/repos/${repoId}/contents/_config.yml`,
    )
      .then(response => {
        return response.ok
      })
      .catch(() => {
        return false
      })
  }

  /** @type {OAuthServiceAPI["getPublishedWebsiteURL"]} */
  getPublishedWebsiteURL({ repoId }) {
    return this.callAPI(`${gitHubApiBaseUrl}/repos/${repoId}/pages`, {
      headers: {
        Authorization: 'token ' + this.accessToken,
        Accept: GITHUB_JSON_ACCEPT_HEADER,
      },
    })
      .then(resp => resp.json())
      .then(({ html_url }) => (html_url ? html_url : undefined))
  }

  /** @type {OAuthServiceAPI["callAPI"]} */
  callAPI(url, requestParams) {
    if (requestParams && requestParams.headers === undefined) {
      requestParams.headers = {
        Authorization: 'token ' + this.accessToken,
      }
    }

    if (requestParams === undefined) {
      requestParams = {
        headers: {
          Authorization: 'token ' + this.accessToken,
        },
      }
    }

    return fetch(url, requestParams).then(httpResp => {
      if (httpResp.status === 404) {
        throw 'NOT_FOUND'
      }

      if (httpResp.status === 401) {
        this.accessToken = undefined
        console.debug('this accessToken : ', this.accessToken)
        throw 'INVALIDATE_TOKEN'
      }
      return httpResp
    })
  }
}
