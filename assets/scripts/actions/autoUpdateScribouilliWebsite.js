//@ts-check

import {stringify} from 'yaml'

import {getRepoConfig} from './repoConfig.js'
import { writeFileAndPushChanges } from './file.js'

/** @typedef {import('../GitAgent.js').default} GitAgent */

/**
 * Cette fonction met à jour automatiquement un repo scribouilli
 * Cette fonctionnalté est devenue nécessaire notamment avec Github qui 
 * déprécie Node.js 16
 * https://github.blog/changelog/2024-03-07-github-actions-all-actions-will-run-on-node20-instead-of-node16-by-default/
 * Pour cette situation, nous devons mettre à jour les fichiers workflow pour les sites github
 * C'est l'occasion de mettre en place un système de mise à jour automatisé pour s'occuper de toutes ces questions
 * dont les personnes qui utilisent Scribouilli ne vont pas s'occuper
 * 
 * 
 * @param {GitAgent} gitAgent 
 */
export default async function autoUpdateScribouilliWebsite(gitAgent){

    const scribouilliRepo = await isScribouilliRepo(gitAgent)

    if(scribouilliRepo){
        

        throw `PPP
            check check si la personne sait se débrouiller
            - si oui, ne pas faire les updates automatisées
            - si non, faire les update automatisées
        `
    }
}

/**
 * 
 * @param {GitAgent} gitAgent 
 * 
 * @returns {Promise<boolean>}
 */
export async function isScribouilliRepo(gitAgent){
    const explicitelyScribouilliRepo = await isExplicitScribouilliRepo(gitAgent)

    if(explicitelyScribouilliRepo){
        console.info('Repo explicitement Scribouilli')
        return true
    }
    else{
        const implicitScribouilliRepo = await isImplicitScribouilliRepo(gitAgent)
        if(implicitScribouilliRepo){
            // Cette branche ne sera plus nécessaire en 2026, par exemple
            console.info('Repo implicitement Scribouilli. On le rend explicitement Scribouilli')
            await makeExplicitScribouilliRepo(gitAgent)
            return true
        }
        else{
            return false
        }
    }
}

/**
 * @param {GitAgent} gitAgent 
 * @returns {Promise<boolean>}
 */
async function isExplicitScribouilliRepo(gitAgent){
    return getRepoConfig(gitAgent)
    .then(config => !!config.scribouilli)
}

/**
 * @param {GitAgent} gitAgent 
 * @returns {Promise<void>}
 */
async function makeExplicitScribouilliRepo(gitAgent){
    const config = await getRepoConfig(gitAgent)
    config.scribouilli = true

    const configYmlContent = stringify(config)

    console.log('configYmlContent', configYmlContent)
    return writeFileAndPushChanges(
        '_config.yml',
        configYmlContent,
        `Rajouter 'scribouilli:true' dans le _config.yml pour rendre le repo explicitement Scribouilli`,
    )
}

/**
 * 
 * @param {GitAgent} gitAgent 
 * @returns {Promise<boolean>}
 */
async function isImplicitScribouilliRepo(gitAgent){
    const workflowFile = await gitAgent.getFile('.github/workflows/build-and-deploy.yml')

    if(workflowFile.includes('Scribouilli')){
        return true;
    }

    const readmeFile = await gitAgent.getFile('LICENSE')

    if(readmeFile.includes('Scribouilli')){
        return true;
    }

    // si un jour on découvre que c'est insuffisant, on peut tenter de regarder dans les topics du repo

    return false
}