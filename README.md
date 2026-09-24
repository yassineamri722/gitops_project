# TaskFlow — application trois tiers

TaskFlow est une application de gestion de tâches organisée en trois couches :

```text
Frontend (public/) → Backend REST (src/) → Base de données SQL (db/)
```

## Structure

```text
.
├── db/schema.sql
├── docs/architecture.md
├── public/
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── src/
│   ├── config/database.js
│   ├── controllers/taskController.js
│   ├── repositories/taskRepository.js
│   ├── routes/taskRoutes.js
│   ├── services/taskService.js
│   └── validators/taskValidator.js
├── .env.example
├── package.json
└── server.js
```

## Fonctionnalités

- création, consultation, modification et suppression de tâches ;
- statut `pending` ou `completed` ;
- priorités `low`, `medium` et `high` ;
- date d'échéance ;
- recherche, filtre et pagination ;
- validation métier séparée du contrôleur ;
- healthcheck de l'API et de la base de données.

## Installation locale

Prérequis : Node.js 20+ et PostgreSQL.

```bash
npm install
cp .env.example .env
npm start
```

L'application est disponible sur http://localhost:3000.

Pour le développement :

```bash
npm run dev
```

Configurez les variables `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` et `PORT` dans votre environnement ou votre fichier `.env`.

## API

| Méthode | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Vérifie l'API et la base de données |
| `GET` | `/api/tasks` | Liste les tâches |
| `GET` | `/api/tasks/:id` | Retourne une tâche |
| `POST` | `/api/tasks` | Crée une tâche |
| `PATCH` | `/api/tasks/:id` | Modifie une tâche |
| `DELETE` | `/api/tasks/:id` | Supprime une tâche |

Exemple de recherche :

```text
GET /api/tasks?search=release&status=pending&page=1&limit=20
```

Création :

```json
{
  "title": "Prepare release",
  "description": "Validate the checklist",
  "priority": "high",
  "dueDate": "2026-10-15"
}
```

## Flux applicatif

```text
Route → Controller → Service → Validator → Repository → PostgreSQL
```

Le frontend ne communique jamais directement avec la base de données. Le repository utilise des requêtes SQL paramétrées.
