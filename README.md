# TaskFlow — application trois tiers

TaskFlow est une application de gestion de tâches construite avec une architecture trois tiers claire :

```text
Frontend (HTML / CSS / JavaScript)
              │
              ▼
Backend (Node.js / Express / API REST)
              │
              ▼
Couche données (repository / SQL / PostgreSQL)
```

## Fonctionnalités

- Créer une tâche avec un titre, une description, une priorité et une date d'échéance
- Consulter la liste des tâches
- Rechercher une tâche par titre ou description
- Filtrer les tâches par statut : `pending` ou `completed`
- Marquer une tâche comme terminée
- Supprimer une tâche
- Valider les données côté backend
- Vérifier la disponibilité de la base de données avec `GET /health`

## Structure du projet

```text
.
├── db/
│   └── schema.sql                 # Schéma SQL et index
├── public/                       # Couche présentation
│   ├── index.html                # Interface utilisateur
│   ├── app.js                    # Appels API et interactions frontend
│   └── styles.css                # Styles de l'interface
├── src/
│   ├── config/
│   │   └── database.js           # Connexion et initialisation DB
│   ├── controllers/
│   │   └── taskController.js     # Adaptateur HTTP
│   ├── repositories/
│   │   └── taskRepository.js     # Accès aux données SQL
│   ├── routes/
│   │   └── taskRoutes.js         # Routes REST
│   └── services/
│       └── taskService.js        # Règles métier et validation
├── package.json
└── server.js                     # Point d'entrée de l'API
```

## Responsabilités des couches

### 1. Frontend

Le dossier `public/` contient l'interface utilisateur. Il communique avec le backend via l'API REST et ne contient aucune logique d'accès direct à la base de données.

### 2. Backend

Le backend Node.js/Express reçoit les requêtes HTTP et les traite selon le flux suivant :

```text
Route → Controller → Service → Repository
```

- **Routes** : définissent les endpoints HTTP
- **Controllers** : convertissent les requêtes HTTP en appels métier
- **Services** : appliquent les règles métier et la validation
- **Repositories** : exécutent les requêtes SQL

### 3. Base de données

Le fichier `db/schema.sql` définit la table `tasks` avec :

- `title`
- `description`
- `completed`
- `priority`
- `due_date`
- `created_at`
- `updated_at`

## Installation locale

Prérequis :

- Node.js 20 ou version supérieure
- PostgreSQL accessible localement

Installer les dépendances :

```bash
npm install
```

Définir les variables de connexion à la base de données si nécessaire :

```bash
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=tasks
export DB_USER=tasks_user
export DB_PASSWORD=tasks_password
```

Démarrer l'application :

```bash
npm start
```

Pour le développement :

```bash
npm run dev
```

L'interface est disponible à l'adresse :

```text
http://localhost:3000
```

## API REST

| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Vérifie l'API et la base de données |
| `GET` | `/api/tasks` | Retourne les tâches |
| `GET` | `/api/tasks/:id` | Retourne une tâche |
| `POST` | `/api/tasks` | Crée une tâche |
| `PATCH` | `/api/tasks/:id` | Modifie une tâche |
| `DELETE` | `/api/tasks/:id` | Supprime une tâche |

### Recherche, filtre et pagination

```text
GET /api/tasks?search=deploy&status=pending&page=1&limit=20
```

Paramètres disponibles :

- `search` : recherche dans le titre et la description
- `status` : `pending` ou `completed`
- `page` : numéro de page
- `limit` : nombre de résultats, limité à 100

### Exemple de création

```json
{
  "title": "Prepare release",
  "description": "Validate the release checklist",
  "priority": "high",
  "dueDate": "2026-10-15"
}
```

## Exemple de réponse

```json
{
  "items": [
    {
      "id": 1,
      "title": "Prepare release",
      "description": "Validate the release checklist",
      "completed": false,
      "priority": "high",
      "dueDate": "2026-10-15",
      "createdAt": "2026-09-24T12:00:00.000Z",
      "updatedAt": "2026-09-24T12:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20
}
```

## Organisation du code

Cette version concerne uniquement le code applicatif : frontend, backend et couche de données. Les configurations de déploiement et d'automatisation sont volontairement séparées du README et du code métier.
