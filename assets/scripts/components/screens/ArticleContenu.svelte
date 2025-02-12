<script>
  import {makeAtelierListArticlesURL} from '../../routes/atelier-list-articles.js'

  /** @type {Promise<EditeurFile>} */
  export let fileP;

  /** @type {any} */
  export let buildStatus;

  /** @type {FileContenu[]} */
  export let contenus;

  /** @type {boolean} */
  export let showArticles;

  /** @type {ScribouilliGitRepo} */
  export let currentRepository;

  import Editeur from "./intern/Editeur.svelte";
</script>

<Editeur
  {fileP}
  {buildStatus}
  {contenus}
  {showArticles}
  {currentRepository}
  editionTitle="Édition d'un article"
  listPrefix={makeAtelierListArticlesURL(currentRepository)}
  deleteTitle="Supprimer l'article"
  on:save
  on:delete
/>
