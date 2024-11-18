<script>
  import Skeleton from '../Skeleton.svelte'
</script>

<Skeleton>
  <section class="screen" id="choose-account">

    <h2>Se connecter</h2>
    <p>
      Scribouilli a besoin de se connecter à l'application qui hébergera votre petit&nbsp;site
    </p>
    <p>
      Vous pouvez utiliser :
    </p>

    <ul class="descriptions">
      <li>
        <strong>Gitlab.com</strong> qui est un hébergeur professionnel
        (si vous n'avez pas encore de compte, Gitlab <a href="https://docs.gitlab.com/ee/security/identity_verification.html#credit-card-verification">vous demandera votre numéro de carte de crédit</a> juste pour vérifier votre identité)
      </li>
      <li>
        <strong>ScribouGit</strong>, l'hébergement géré par l'équipe de Scribouilli
        (si vous n'avez pas encore de compte, nous prendrons le temps de le valider manuellement (cela peut prendre quelques jours))
      </li>
      <li>Microsoft GitHub®, si vous l'utilisez déjà</li>
    </ul>

    <ul class="buttons">
      <li><a href="./account?provider=gitlab.com" class="btn">Gitlab</a></li>
      <li><a href="./account?provider=git.scribouilli.org" class="btn">ScribouGit</a></li>
      <li><a href="./account?provider=github.com" class="btn">Github</a></li>
    </ul>
  </section>
</Skeleton>

<style lang="scss">
  #choose-account {
    max-width: 80ch;
    margin: 0 auto;

    ul.descriptions {
      text-align: left;
      list-style-type: disc;

      margin-bottom: 3rem;

      li {
        margin-bottom: 1rem;
      }
    }

    ul.buttons{
      display: flex;
      flex-direction: row;
      justify-content: space-around;

      margin-bottom: 1rem;
    }
  }

  p {
    font-size: 1.5rem;
  }
</style>
