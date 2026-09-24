# GitOps Project — Three-tier task application

Application simple et modulaire pour servir de base à une future chaîne DevOps. Elle contient uniquement le code applicatif : aucune configuration Docker, Kubernetes ou CI/CD n'est incluse.

## Architecture

- **Frontend** : HTML/CSS/JavaScript vanilla dans `public/`.
- **Backend/API** : Node.js + Express, organisé en routes, contrôleurs, services et repositories dans `src/`.
- **Base de données** : SQLite via `better-sqlite3`, initialisée avec `db/schema.sql`.

Le frontend consomme l'API REST `/api/tasks`. Les données sont stockées dans `data/tasks.db`, créé automatiquement au premier démarrage.

## Démarrage local

Prérequis : Node.js 20+

```bash
npm install
npm start
```

Puis ouvrir http://localhost:3000.

Mode développement :

```bash
npm run dev
```

## API

- `GET /health` — vérification de santé
- `GET /api/tasks` — liste des tâches
- `GET /api/tasks/:id` — détail d'une tâche
- `POST /api/tasks` — crée `{ "title": "...", "description": "..." }`
- `PATCH /api/tasks/:id` — modifie `title`, `description` ou `completed`
- `DELETE /api/tasks/:id` — supprime une tâche

## Suite DevOps prévue

Les étapes suivantes pourront être ajoutées séparément : Dockerfile et compose, manifestes Helm/Kubernetes, pipeline CI/CD, tests automatisés, gestion des secrets et observabilité.
