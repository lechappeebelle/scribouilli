/**
 * @typedef {Object} ScribouilliGitRepo
 * @property {string} repoId
 * @property {string} owner
 * @property {string} repoName
 * @property {string} origin
 * @property {Promise<string>} publishedWebsiteURL
 * @property {string} publicRepositoryURL
 */

/**
 * @typedef {Object} GitSiteTemplate
 * @property {string} url
 * @property {string} description
 * @property {string} githubRepoId
 */

/**
 * @typedef {"in_progress" | "success" | "error" | "needs_account_verification" } BuildStatus
 */

/**
 * @typedef {Object} OAuthServiceAPI
 * @property {(url: string, requestParams?: RequestInit) => Promise<Response>} callAPI
 * // https://isomorphic-git.org/docs/en/onAuth#oauth2-tokens
 * @property {() => {username: string, password: string}} getOauthUsernameAndPassword
 * @property {() => Promise<any>} getAuthenticatedUser
 * @property {() => Promise<AuthenticatedUserEmails[]>} getUserEmails
 * @property {(scribouilliGitRepo: ScribouilliGitRepo, template: GitSiteTemplate) => Promise<{remoteURL: string}>} createDefaultRepository
 * @property {(scribouilliGitRepo: ScribouilliGitRepo) => Promise<boolean>} isRepositoryReady
 * @property {() => Promise<GithubRepository[]>} getCurrentUserRepositories
 * @property {(scribouilliGitRepo: ScribouilliGitRepo) => Promise<any>} deploy
 * @property {(scribouilliGitRepo: ScribouilliGitRepo) => Promise<BuildStatus>} getPagesWebsiteDeploymentStatus
 * @property {(scribouilliGitRepo: ScribouilliGitRepo) => Promise<boolean>} isPagesWebsiteBuilt
 * @property {(scribouilliGitRepo: ScribouilliGitRepo) => Promise<string | undefined>} getPublishedWebsiteURL
 */

/**
 * @typedef {Object} GithubOptions
 * @property {string} accessToken
 */

/**
 * @typedef {Object} GitlabOptions
 * @property {string} accessToken
 * @property {string} origin
 * @property {string} refreshToken
 * @property {string} expiredIn
 * @property {string} state
 */

/**
 * @typedef {Object} AuthenticatedUserEmails
 * @property {string} email
 * @property {boolean} primary
 */

/**
 * @typedef {Object} GithubDeployment
 * @property {string} statuses_url
 */

/**
 * @typedef {Object} GithubRepository
 * @property {string} name
 * @property {Object} owner
 * @property {string} owner.login
 */

/**
 * A git commit object.
 *
 * @typedef {Object} CommitObject
 * @property {string} message Commit message
 * @property {string} tree SHA-1 object id of corresponding file tree
 * @property {string[]} parent an array of zero or more SHA-1 object ids
 * @property {Object} author
 * @property {string} author.name The author's name
 * @property {string} author.email The author's email
 * @property {number} author.timestamp UTC Unix timestamp in seconds
 * @property {number} author.timezoneOffset Timezone difference from UTC in minutes
 * @property {Object} committer
 * @property {string} committer.name The committer's name
 * @property {string} committer.email The committer's email
 * @property {number} committer.timestamp UTC Unix timestamp in seconds
 * @property {number} committer.timezoneOffset Timezone difference from UTC in minutes
 * @property {string} [gpgsig] PGP signature (if present)
 */
