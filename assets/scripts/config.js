export const OAUTH_PROVIDER_STORAGE_KEY = 'scribouilli_oauth_provider'
export const TOCTOCTOC_ACCESS_TOKEN_URL_PARAMETER = 'access_token'
export const TOCTOCTOC_OAUTH_PROVIDER_URL_PARAMETER = 'type'
export const TOCTOCTOC_OAUTH_PROVIDER_ORIGIN_PARAMETER = 'origin'
export const defaultRepositoryName = 'mon-scribouilli'
export const gitHubApiBaseUrl = 'https://api.github.com'

export const CUSTOM_CSS_PATH = 'assets/css/custom.css'

/** @type {GitSiteTemplate[] & {default: GitSiteTemplate}} */
// @ts-ignore
export const templates = [
  {
    url: 'https://github.com/Scribouilli/site-template-2024.git',
    description: 'un site de candidat·e aux législatives 2024',
    githubRepoId: 'Scribouilli/site-template-2024',
  },
]

templates.default = templates[0]

/** @type {Element} */
export const svelteTarget = document.body
