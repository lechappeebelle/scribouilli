//@ts-check

import {parseDocument} from 'yaml'
import { fetchAuthenticatedUserLogin } from './actions/current-user'

/** @import GitAgent from './GitAgent' */
/** @import YAML from 'yaml' */
/** @import {ScribouilliGitRepo, OAuthServiceAPI, ScribouilliGitUser} from './types.js' */

/**
 * @type {ScribouilliGitRepo}
 */
export default class {

  /** @type {OAuthServiceAPI} */
  #gitServiceProvider

  /** @type {Promise<YAML.Document>} */
  #jekyllConfig

  /** @type {((error: string | Error) => void) | undefined} */
  #onLoginFailed

  /** @type {ScribouilliGitUser['login']} */
  #login
  get login(){
    return this.#login
  }


  /**
   *
   * @param { object } _
   * @param { string } [_.repoId]
   * @param { string } _.origin
   * @param { string } _.publicRepositoryURL
   * @param { string } _.owner
   * @param { string } _.repoName
   * @param { OAuthServiceAPI } _.gitServiceProvider
   * @param { GitAgent } _.gitAgent
   * @param { (error: string | Error) => void } [_.onLoginFailed]
   */
  constructor({
    repoId,
    origin,
    publicRepositoryURL,
    owner,
    repoName,
    gitServiceProvider,
    gitAgent,
    onLoginFailed
  }) {
    throw "repoId in gitlab is encodeURIComponent(`${owner}/${repoName}`) mais pour le fs, ça ne marcherait pas"


    this.origin = origin
    this.publicRepositoryURL = publicRepositoryURL
    this.owner = owner
    this.repoName = repoName
    /** @type {GitAgent} */
    this.gitAgent = gitAgent
    this.#gitServiceProvider = gitServiceProvider
    this.#onLoginFailed = onLoginFailed

    this.repoId = repoId ? repoId : makeRepoId(owner, repoName)

    this.publishedWebsiteURL = new Promise(resolve => {
      const interval = setInterval(() => {
        this.#gitServiceProvider.getPublishedWebsiteURL(this)
        .then(url => { 
          if(url){
            clearInterval(interval)
            resolve(url) 
          }
        })
      }, 1000)
    })

    const authorSet = this.fetchAuthenticatedUserLoginAndEmail()
      .then(({login, email}) => gitAgent.setAuthor(login, email))

    const repoSynced = gitAgent.pullOrCloneRepo()

    repoSynced.then(() => {
      this.#jekyllConfig = this.gitAgent
        .getFile('_config.yml')
        .then(configStr => parseDocument(configStr))
      
      this.#jekyllConfig.then(conf => console.log('conf', conf))
    })
    


    throw `PPP
      rajouter ici setBaseUrlInConfigIfNecessary() (après le parsing du config.yml)
      rajouter les store.mutations.setLogin qui ont disparu ?
    `


    this.ready = Promise.all([authorSet, repoSynced]).then(() => undefined)



    throw `PPP 
      - internaliser le clone ici + setBaseUrlInConfigIfNecessary (sortir la fonction des actions et la mettre ici)
      - recups + parser le _config.yml ici avec la fonction parseDocument (qui préserve les commentaires)
      - permettre un accès en lecture à la config
        - remplacer toutes les lectures de _config.yml dans le code par ce qu'il se passe ici
      - permettre un changeConfig avec un Object.assign + commit push direct   
    `
  }

  /**
   * @summary edit the config with the diff passed as argument
   * 
   * 
   */
  editConfig(configDiff){

  }

  /**
   * 
   * @returns {Promise<{login: string, email: string}>}
   */
  fetchAuthenticatedUserLoginAndEmail(){
    const loginP = this.#gitServiceProvider
      .getAuthenticatedUser()
      .then(({ login }) => {
        if (!login) {
          throw new Error('No login')
        }

        return login
      })
      .catch(err => {
        if(this.#onLoginFailed){
          this.#onLoginFailed(err)
        }
        throw err
      })

    const emailP = this.#gitServiceProvider
      .getUserEmails()
      .then(emails => {
        const email = (emails.find(e => e.primary) ?? emails[0]).email
        return email
      })
      .catch(err => {
        if(this.#onLoginFailed){
          this.#onLoginFailed(err)
        }
        throw err
      })

    return Promise.all([loginP, emailP])
      .then(([login, email]) => ({login, email}))
  }


}

/**
 *
 * @param {string} owner // may be an individual Github user or an organisation
 * @param {string} repoName
 * @returns {string}
 */
export function makeRepoId(owner, repoName) {
  return `${owner}/${repoName}`
}

/**
 *
 * @param {string} owner // may be an individual Github user or an organisation
 * @param {string} repoName
 * @param {string} origin
 * @returns {string}
 */
export function makePublicRepositoryURL(owner, repoName, origin) {
  return `${origin}/${owner}/${repoName}`
}


