<script>
  import store from '../../../store.js'
  import Skeleton from '../../Skeleton.svelte'
  import { makePageFrontMatter } from '../../../utils.js'
  import './../../../types.js'

  /** @type {any} */
  export let buildStatus

  /** @type {FileContenu[]} */
  export let listContenu = []

  /** @type {string} */
  export let title

  /** @type {string} */
  export let atelierPrefix

  /** @type {string} */
  export let newContentButtonText

  /** @type {boolean | undefined} */
  export let showArticles

  /** @type {ScribouilliGitRepo} */
  export let currentRepository

  /** @type {boolean} */
  export let allowModification

  /** @type {import('../../../store').ScribouilliState["conflict"]}*/
  export let conflict

  /** @type {string} */
  let repoName
  $: repoName = currentRepository.repoName

  /** @type {string} */
  let account
  $: account = currentRepository.owner

  let modification = false

  const gitAgent = store.state.gitAgent

  if(!gitAgent){
    throw new TypeError('gitAgent is undefined')
  }

  // PPP move this to an action
  // @ts-ignore
  const editClick = async e => {
    if (modification) {
      for (let page of listContenu) {
        // for + await leads to poor pref. PPP: do a Promise.all
        await gitAgent.writeFile(
          page.path,
          `${
            page.title
              ? makePageFrontMatter(
                  page.title,
                  page.index,
                  page.inMenu,
                  page.blogIndex ? true : undefined,
                ) + '\n'
              : ''
          }${page.content}`,
        )
      }

      await gitAgent.commit(
        'Changements menu',
      )

      await gitAgent.safePush()
    }
    modification = !modification
  }
</script>

<Skeleton {currentRepository} {buildStatus} {showArticles} {conflict}>
  <section class="screen">
    <div>
      <header>
        <h2>
          {title}
        </h2>
        <a
          href="{atelierPrefix}?repoName={repoName}&account={account}"
          class="btn btn__medium">{newContentButtonText}</a
        >
      </header>

      <div>
        <ul>
          {#each listContenu as contenu}
            <li>
              <span>{contenu.title}</span>
              {#if modification}
                <div class="gestionMenu">
                  <label>
                    Ordre de la page dans le menu
                    <input
                      class="order"
                      aria-label="Ordre de la page dans le menu"
                      type="number"
                      min="1"
                      max={store.state.pages?.length}
                      bind:value={contenu.index}
                    />
                  </label>
                  <label>
                    Afficher dans le menu
                    <input
                      class="inMenu"
                      aria-label="Affichage de la page dans le menu"
                      type="checkbox"
                      bind:checked={contenu.inMenu}
                    />
                  </label>
                </div>
              {:else}
                <a
                  href="{atelierPrefix}?path={encodeURIComponent(contenu.path)}&repoName={repoName}&account={account}"
                >
                  Modifier</a
                >
              {/if}
            </li>
          {/each}
        </ul>
        {#if allowModification}
          <button class="btn btn_small btn_secondary" on:click={editClick}
            >{#if modification}
              Enregistrer
            {:else}
              Modifier le menu
            {/if}</button
          >
        {/if}
      </div>
    </div>
  </section>
</Skeleton>

<style lang="scss">
  ul {
    margin: auto;
    margin-bottom: 4rem;
    text-align: left;
    width: 25em;

    li {
      font-size: 1.3rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1em;
      padding: 1rem;
      position: relative;

      & + li {
        border-top: 1px solid black;
      }

      .gestionMenu {
        label {
          display: flex;
          align-items: center;
          font-weight: normal;
          font-size: 1rem;
          margin-top: 0.5em;
        }
        .order {
          max-width: 3em;
        }

        .inMenu {
          display: block;
          width: auto;
          margin-right: 0.5em;
          margin-top: 0.5em;
        }
      }

      a::before {
        content: ' ';
        display: block;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }

      label {
        input {
          width: 100%;
          margin-left: 0.5em;
        }
      }
    }
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 5em;
    width: 26em;
    margin: 3rem auto;
    padding: 0;
    border: none;

    & > * {
      flex: 0 1 auto;
    }

    h2 {
      margin: 0.2em 0;
    }
  }
</style>
