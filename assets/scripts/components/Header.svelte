<script>
  /** @type {{ status: BuildStatus }} */
  export let buildStatus

  /** @typedef {import("./../store.js").ScribouilliState} ScribouilliState */
  /** @type {ScribouilliState["currentRepository"] | undefined} */
  export let currentRepository

  /** @type {boolean} */
  export let showArticles

  /** @type {ScribouilliState["conflict"]}*/
  export let conflict

  /** @type {string} */
  let status

  $: status = buildStatus?.status

  if (buildStatus) {
    // @ts-ignore
    buildStatus.subscribe(s => {
      if (s) { 
        status = s
      }
    })
  }

  /** @type {boolean}*/
  let needsAccountVerification
  $: needsAccountVerification = status === 'needs_account_verification'

  $: buildStatusClass = buildStatus ? `build-${status}` : undefined

  /** @type {Promise<string> | undefined } */
  let publishedWebsiteURL
  $: publishedWebsiteURL = currentRepository?.publishedWebsiteURL

  /** @type {string | undefined} */
  let repositoryURL
  $: repositoryURL = currentRepository?.publicRepositoryURL

  /** @type {string | undefined} */
  let repoName
  $: repoName = currentRepository?.repoName

  /** @type {string | undefined} */
  let account
  $: account = currentRepository?.owner

  /** @type {string | undefined} */
  $: homeURL =
    repoName && account
      ? `/atelier-list-pages?repoName=${repoName}&account=${account}`
      : '/'
  /**
   *
   * @param {string} account
   * @param {string} repoName
   * @returns {string}
   */
  function makeResolutionDesynchronisationURL(account, repoName) {
    return `/resolution-desynchronisation?account=${account}&repoName=${repoName}`
  }

  /** @type {string} */
  let resolutionURL;
  $: resolutionURL = makeResolutionDesynchronisationURL(account || '', repoName || '')

</script>

<header>
  {#if currentRepository}
    {#await publishedWebsiteURL}
      <div>
        <p>
          (L'adresse du site va apparaître ici…)
        </p>
        {#if buildStatusClass}
          <p class={buildStatusClass} />
        {/if}
      </div>
    {:then publishedURL}
      <div>
        <p>
          <a
            href="{publishedURL}"
            class="project-name"
            target="_blank"
          >
            {publishedURL}
          </a>
        </p>
        {#if buildStatusClass}
          <p class={buildStatusClass} />
        {/if}
      </div>
    {/await}
  {/if}

  <h1>
    <a href={homeURL} class="go-home"
      ><img
        src="./assets/images/logo_atelier.png"
        alt="L'atelier de Scribouilli"
      /></a
    >
  </h1>

  {#if currentRepository}
    <nav>
      <ul>
        <li>
          <a href="/atelier-list-pages?repoName={repoName}&account={account}">
            Pages
          </a>
        </li>

        {#if showArticles}
          <li>
            <a
              href="/atelier-list-articles?repoName={repoName}&account={account}"
            >
              Articles
            </a>
          </li>
        {/if}

        <li>
          <a href="/settings?repoName={repoName}&account={account}">
            Paramètres
          </a>
        </li>
        <li>
          {#if repositoryURL}
            {#await repositoryURL then urlrepository}
              <a href={urlrepository} target="_blank">Sur {(new URL(urlrepository)).hostname}</a>
            {/await}
          {/if}
        </li>
      </ul>
    </nav>
  {/if}
</header>

{#if conflict}
  <section class="warning warning-center">
    <p><span aria-hidden='true'>⚠️</span> <strong>Attention !</strong> Votre site ne peut plus se mettre à jour.</p>

    <p><a href={resolutionURL} class="btn btn__medium">Voir le problème</a></p>
  </section>
{/if}

{#if needsAccountVerification}
  <section class="warning warning-center">
    <p class="centered"><span>⚠️</span> <strong>Attention..</strong></p>

    <p>
      Votre site ne peut pas être publié car GitLab exige de vérifier votre identité avec un n° de téléphone (ou un n° de carte bleue).
    </p>

    <p>
      <a href="https://gitlab.com/-/identity_verification" class="btn btn__medium">
        Vérifier mon identité
      </a>
    </p>
  </section>
{/if}

<style lang="scss">
  header {
    margin-bottom: 2rem;
    padding-right: 2rem;
    padding-left: 2rem;
    border-bottom: 1px solid #4d4646;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  header > * {
    flex: 1;
  }

  header > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  header > div > p {
    margin: 0em;
  }

  header h1 {
    text-align: center;
  }

  header img {
    max-height: 3em;
  }

  .warning{
    max-width: 46rem;
    margin: 0 auto;
    padding: 2rem;
    border-radius: 1rem;
    margin-bottom: 3rem;
    background-color: #fff4e5;
    border: 3px solid #ff4800;

    p {
      margin-top: 0;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .btn {
      background-color: transparent;
    }

    span {
      display: block;
      font-size: 200%;
    }

    .centered {
      text-align: center;
    }

    &-center {
      text-align: center;

      strong {
        display: block;
      }
    }
  }


  [class^='build-'] {
    margin-top: 0.3rem;
  }

  .build-in_progress::after {
    content: '🕰 En cours de publication (2-3 min)';
  }

  .build-success::after {
    content: '✅ Site à jour';
  }

  .build-error::after {
    content: '🕰 En cours de publication (15 min max)';
  }


</style>
