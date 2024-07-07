//@ts-check

import {parse, stringify} from 'yaml'

import store from '../store.js'
import { writeFileAndPushChanges } from './file.js'

/**
 * @param {import('./autoUpdateScribouilliWebsite.js').GitAgent} gitAgent
 * @returns {Promise<any>}
 */
export const getRepoConfig = (gitAgent) => {  
    if(!gitAgent)
        throw new Error('Missing gitAgent')

    return gitAgent
      .getFile('_config.yml')
      .then(configStr => parse(configStr))
}

throw `PPP
    parser le yaml avec la fonction parseDocument (qui préserve les commentaires)
    Créer une fonction qui permet de rajouter du contenu à la config (tout en gardant les commentaires)
        via https://eemeli.org/yaml/#creating-nodes
    
`