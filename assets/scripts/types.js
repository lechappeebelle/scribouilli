

/**
 * @typedef {Object} ScribouilliGitRepo
 * @property {string} repoId
 * @property {string} origin
 * @property {string} publishedWebsiteURL
 * @property {string} publicRepositoryURL
 * @property {string} hostname
 * @property {string} repoDirectory
 * @property {string} remoteURL
 * @property {(filename: string) => string} path
 */

/**
 * @typedef {Object} OAuthProvider
 * @property {function} getServiceAPI
 */


/**
 * @typedef {Object} OAuthServiceAPI
 * @property {(url: string, requestParams?: RequestInit) => Promise<Response>} callAPI
 * @property {() => string|undefined} getAccessToken
 * @property {() => Promise<any>} getAuthenticatedUser
 * @property {() => Promise<GithubUserEmails[]>} getUserEmails
 * @property {(scribouilliGitRepo: ScribouilliGitRepo) => Promise<GithubRepository>} getRepository
 * @property {() => Promise<GithubRepository[]>} getCurrentUserRepositories
 * @property {(scribouilliGitRepo: ScribouilliGitRepo) => Promise<any>} createDefaultRepository
 * @property {(scribouilliGitRepo: ScribouilliGitRepo) => Promise<any>} addTopicOnRepository
 * @property {(scribouilliGitRepo: ScribouilliGitRepo) => Promise<any>} updateRepositoryFeaturesSettings
 * @property {(scribouilliGitRepo: ScribouilliGitRepo) => Promise<any>} deleteRepository
 * @property {(scribouilliGitRepo: ScribouilliGitRepo) => Promise<any>} createPagesWebsiteFromRepository
 * @property {(scribouilliGitRepo: ScribouilliGitRepo) => Promise<any>} getPagesWebsiteDeploymentStatus
 * @property {(scribouilliGitRepo: ScribouilliGitRepo) => Promise<boolean>} isPagesWebsiteBuilt
 * @property {(scribouilliGitRepo: ScribouilliGitRepo) => Promise<boolean>} isRepositoryReady
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
 * @typedef {Object} GithubUserEmails
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
 */

/**
 * @typedef {Object} FileContenu
 * @property {string} path
 * @property {string} title
 * @property {string} content
 * @property {number} index
 * @property {boolean} inMenu
 */
