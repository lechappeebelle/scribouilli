<script>
  import Skeleton from "../Skeleton.svelte";

  /** @type {string} */
  export let gitProvider
</script>

<Skeleton>
  {#if gitProvider === 'github.com'}
  <section class="screen">
    <div>
      <h2>Créer un compte GitHub</h2>
      <p>
        Pour pouvoir publier votre contenu, il faut que Scribouilli se connecte
        à un compte <a href="https://github.com" target="_blank">GitHub</a>.
      </p>
      <p>La création va se passer sur GitHub.com.</p>
      <p class="npa">Elle comporte 3 étapes :</p>
      <ol>
        <li>
          Rentrez votre mail, mot de passe, et votre nom d'utilisateur·ice
        </li>
        <li>
          Ouvrez le mail que GitHub vous a envoyé, et copiez le code pour
          confirmer votre compte
        </li>
        <li>
          Dès que le code est validé, <strong>revenez sur Scribouilli</strong> et
          cliquez sur <a href="./login?provider=github.com">"J'ai créé un compte"</a>
        </li>
      </ol>

      <div class="btn-list">
        <a href="https://github.com/signup" target="_blank" class="btn"
          >Créer un compte GitHub</a
        >
        <a href="./login?provider=github.com" class="btn">J'ai créé un compte</a>
      </div>
    </div>
  </section>
  {/if}

  {#if gitProvider === 'gitlab.com'}
  <section class="screen">
    <div>
      <h2>Créer un compte sur gitlab.com</h2>

      <div class="btn-list">
        <a href="https://gitlab.com/users/sign_up" target="_blank" class="btn"
          >Créer un compte gitlab.com</a
        >
        <a href="./login?provider=gitlab.com" class="btn">J'ai créé un compte</a>
      </div>
    </div>
  </section>
  {/if}

  {#if gitProvider === 'git.scribouilli.org'}
    <section class="screen">
      <div>
        <h2>Créer un compte sur git.scribouilli.org</h2>

        <p>
          Pour vérifier que vous n'êtes pas un robot, envoyez-nous un mail à
          <strong>coucou@scribouilli.org</strong> en indiquant :
        </p>

        <ul class="simple-list">
          <li>le pseudo que vous souhaitez,</li>
          <li>l'email avec lequel vous voulez créer votre compte,</li>
          <li>un message pour nous indiquer quel genre de petit site vous voulez
          créer.</li>
        </ul>
        <p> Pour information, la création du compte pourrait prendre quelques jours de notre côté, on vous préviendra par mail quand c'est fait !
        </p>
      </div>
    </section>
  {/if}

</Skeleton>

<style lang="scss">
  .screen {
    max-width: 70%;
    margin: 0 auto;

    & > div {
      display: flex;
      justify-content: center;
      flex-direction: column;
      font-size: 1.5rem;
    }
  }

  .screen h2 {
    margin-bottom: 2rem;
  }

  ol {
    text-align: left;
  }
  ol li {
    margin-bottom: 1rem;
  }

  .npa {
    text-align: left;
  }

  .btn-list {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: center;
    margin-top: 4rem;
  }

  .simple-list {
    padding: 1rem 5rem;
    text-align: left;
    list-style-type: disc;
    list-style-position: inside;
   }
</style>
