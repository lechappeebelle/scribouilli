// @ts-check

import { svelteTarget, CUSTOM_CSS_PATH } from '../config'
import { replaceComponent } from '../routeComponentLifeCycle'
import store from '../store'
import {
  getCurrentRepoPages,
  getCurrentRepoArticles,
  setCurrentRepositoryFromQuerystring,
  saveCustomCSS,
} from '../actions/current-repository.js'
import { handleErrors } from '../utils'
import Settings from '../components/screens/Settings.svelte'
import { writeFileAndCommit, deleteFileAndCommit } from '../actions/file'
import { blogIndex, showArticles } from '../actions/article'

const blogMdContent = `---
layout: page
title: Articles
permalink: /articles/
blog_index: true
---
<aside>
  S'abonner via le <a href="{{ '/feed.xml' | relative_url }}">flux RSS</a>
  (<a href="https://flus.fr/carnet/a-quoi-servent-les-flux.html">c'est quoi ?</a>)
</aside>

{% for post in site.posts %}
<article class="blog-item">
  <h2>
    <a href="{{post.url | relative_url}}"> {{ post.title }} </a>
  </h2>

  <a href="{{post.url | relative_url}}"> Lire l'article ➞ </a>
</article>
<hr />
{% endfor %}
`

/**
 *
 * @param {import('../store').ScribouilliState} state
 * @returns
 */
function mapStateToProps(state) {
  const blogFile = blogIndex(state)
  const currentRepository = store.state.currentRepository

  if (!currentRepository) {
    throw new TypeError('currentRepository is undefined')
  }

  return {
    buildStatus: state.buildStatus,
    theme: state.theme,
    deleteRepositoryUrl: `${currentRepository.publicRepositoryURL}/settings#danger-zone`,
    blogEnabled: blogFile !== undefined,
    showArticles: showArticles(state),
    currentRepository: state.currentRepository,
  }
}

/**
 * @param {import('page').Context} _
 */
export default async ({ querystring }) => {
  await setCurrentRepositoryFromQuerystring(querystring)

  const { gitAgent } = store.state

  if (!gitAgent) {
    throw new TypeError('gitAgent is undefined')
  }

  const settings = new Settings({
    target: svelteTarget,
    props: mapStateToProps(store.state),
  })

  settings.$on('update-theme', ({ detail: { theme } }) => {
    saveCustomCSS(theme.css).catch(handleErrors)
  })

  settings.$on('toggle-blog', async ({ detail: { activated } }) => {
    try {
      if (activated) {
        await writeFileAndCommit('blog.md', blogMdContent, 'Activation du blog')
      } else {
        await deleteFileAndCommit('blog.md', 'Désactivation du blog')
      }
      await getCurrentRepoArticles()
      await getCurrentRepoPages()

      gitAgent.safePush()
    } catch (msg) {
      //@ts-ignore
      handleErrors(msg)
    }
  })

  if (!store.state.theme.css) {
    gitAgent
      .getFile(CUSTOM_CSS_PATH)
      .then(content => {
        store.mutations.setTheme(content)
      })
      .catch(msg => handleErrors(msg))
  }

  getCurrentRepoPages()

  replaceComponent(settings, mapStateToProps)
}
