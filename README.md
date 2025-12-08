# CapBio Backend

Simple Node/Express + Sequelize backend for posts and messages.

## Features
- Sequelize models for `user`, `ticket` and `service` tables
- `POST` and `GET` endpoints for `/user`, `/ticket`, and `/service`
- File upload for service photos using `multer`
- Uses MySQL (mysql2) as database

## Setup
1. Copy `.env.example` to `.env` and set DB credentials.

2. Install dependencies:

```bash
cd attente_backend
npm install
```

3. Start the server

```bash
npm run dev
```