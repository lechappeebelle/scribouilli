
## Les chemins pour le CSS et les fonts
Dans le template `default.html` on définissait `href="{{site.url}}/assets/css/custom.css"` et ça mettait une erreur CORS sur la typo et elle ne se chargeait pas.
Pour résoudre ça et que ça marche en local et en prod : 
- on a trouvé comment faire des urls relatives dans la doc Jekyll (section "Relative URL") https://jekyllrb.com/docs/liquid/filters/#relative-url
- on a mis `{{ '/assets/css/styles.css' | relative_url }}` pour que ça marche dans notre contexte

Faudrait faire la même chose pour les autres assets (genre images, js, etc.)

  (écrit initialement en Juin 2023 par @newick)
