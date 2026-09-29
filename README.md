# Cours complet sur Claude

Application web statique (HTML/CSS/JS, sans build ni dépendances) pour se former à
l'utilisation de Claude, des bases jusqu'aux fonctionnalités avancées, avec un fil
rouge appliqué : automatiser la gestion d'une activité de location courte durée
(« Love Room »).

## Utilisation

Aucune installation n'est nécessaire.

- **Le plus simple** : ouvrez `index.html` directement dans un navigateur.
- **Avec un petit serveur local** (recommandé si votre navigateur bloque certaines
  fonctionnalités en `file://`) :
  ```bash
  python3 -m http.server 8080
  # puis ouvrez http://localhost:8080
  ```

La progression (modules terminés, cases cochées) est enregistrée dans le
`localStorage` du navigateur : elle reste sur l'appareil utilisé et n'est envoyée
nulle part.

## Structure

```
index.html                     Page d'accueil / feuille de route
01-bases.html                  Module 1 — Plateformes et produits Claude
02-prompting.html              Module 2 — Prompt engineering
03-artifacts.html              Module 3 — Artifacts
04-skills.html                 Module 4 — Claude Skills
05-workflows.html              Module 5 — Workflows
06-connectors.html             Module 6 — Connectors
07-automation.html             Module 7 — Automation
08-claude-code.html            Module 8 — Claude Code
09-projets-pratiques.html      Module 9 — Construire un site / une appli / un agent
10-business-loveroom.html      Module 10 — Cas concret : automatiser Love Room
11-ressources.html             Liens officiels, glossaire, points à vérifier
12-agent-immobilier.html       Atelier bonus — construire un agent de recherche immobilière
profil.html                    Profil local (infos de l'appartement) pour personnaliser les prompts
assets/css/style.css           Style partagé (clair/sombre automatique)
assets/js/app.js               Suivi de progression, profil, quiz (localStorage)
```

## Note sur la fiabilité du contenu

Les produits Anthropic, leurs tarifs et leurs fonctionnalités évoluent régulièrement.
Le cours signale explicitement (encarts ⚠️) les points qui doivent être vérifiés sur
les sources officielles avant toute décision engageant du temps ou de l'argent :
[claude.com/pricing](https://claude.com/pricing) et
[support.claude.com](https://support.claude.com).
