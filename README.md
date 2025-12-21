# Backend - Gestion de Tickets

Backend simple Node/Express + Sequelize pour gérer des tickets d’attente.

## Fonctionnalités
- Modèles Sequelize pour les tables `user`, `ticket` et `service`
- Endpoints `POST` et `GET` pour `/user`, `/ticket` et `/service`
- Upload de fichiers pour les photos de service via `multer`
- Notifications en temps réel avec `Socket.IO`
- Utilisation de MySQL (`mysql2`) comme base de données

## Prérequis
1. Node.js >= 18 et npm installés
2. Une base de données MySQL
3. Copier le fichier `.env.example` en `.env` et adaoter a votre structure

## Installation

1. Cloner le projet et se rendre dans le dossier backend :

```bash
cd attente_backend
```

2. Installer les dépendances :

```bash
cd attente_backend
npm install
```

3. Demarrer le serveur

```bash
npm run dev
```

Cette commande démarre le serveur et crée automatiquement les tables dans la base de données via Sequelize.