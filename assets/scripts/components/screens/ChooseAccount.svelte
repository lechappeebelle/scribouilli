<script>
  import Skeleton from '../Skeleton.svelte'
</script>

<Skeleton>
  <section class="screen" id="choose-account">

    <h2>Se connecter</h2>
    <p>
      Scribouilli 2024 a besoin de se connecter à Github pour publier votre site.
    </p>
    <p>
      Vous allez créer votre compte sur Github, idéalement avec :
    </p>

    <ul class="descriptions">
      <li>
        un nom de compte "neutre" pour garder votre anonymat (par exemple, le nom du candidat + numéro de département)
      </li>
      <li>
        un mot de passe que vous n'utilisez pas ailleurs, notamment si vous avez besoin de le faire passer à d'autres militants
      </li>
    </ul>
    <p>
      Une fois le compte créé <strong>revenez sur cet onglet</strong>, la redirection n'est pas automatique !!
    </p>

    <ul class="buttons">
      <li><a href="./account?provider=github.com" class="btn">Se connecter à Github</a></li>
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
