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

