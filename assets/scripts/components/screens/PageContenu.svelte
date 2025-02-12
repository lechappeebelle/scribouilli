<script>
  import {makeAtelierListPageURL} from '../../routes/urls.js'

  /** @type {Promise<EditeurFile>} */
  export let fileP;

  /** @type any */
  export let buildStatus;

  /** @type {FileContenu[]} */
  export let contenus;

  /** @type {boolean} */
  export let showArticles

  /** @type {ScribouilliGitRepo} */
  export let currentRepository;

  import Editeur from "./intern/Editeur.svelte";
</script>

<Editeur
  {fileP}
  {currentRepository}
  {buildStatus}
  {contenus}
  {showArticles}
  editionTitle="Édition d'une page"
  listPrefix={makeAtelierListPageURL(currentRepository)}
  deleteTitle="Supprimer la page"
  on:save
  on:delete
/>
