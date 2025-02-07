/**
 * @typedef {Object} Page
 * @property {string} path
 * @property {string} title
 * @property {string} [content]
 * @property {boolean} [inMenu]
 * @property {boolean} [blogIndex] Is this page the index of the blog section? Defaults to false.
 * @property {number} index
 */

/**
 * @typedef {Object} Article
 * @property {string} path
 * @property {string} title
 * @property {string} [content]
 */

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
 * @property {(scribouilliGitRepo: ScribouilliGitRepo) => Promise<any>} getPagesWebsiteDeploymentStatus
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

/** @typedef {"building" | "built" | "errored"} BuildStatus */

/**
 * @typedef {Object} EditeurFile
 * @property {string} fileName
 * @property {string} content
 * @property {string | undefined} previousContent
 * @property {string} title
 * @property {number} index
 * @property {string | undefined} previousTitle
 * @property {boolean} blogIndex
 */

/**
 * @typedef {Object} FileContenu
 * @property {string} path
 * @property {string} title
 * @property {string} content
 * @property {number} index
 * @property {boolean} inMenu
 * @property {boolean} blogIndex
 */
