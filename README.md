# Backend

Simple Node/Express + Sequelize backend.

## Features
- Sequelize models for `user`, `ticket` and `service` tables
- `POST` and `GET` endpoints for `/user`, `/ticket`, and `/service`
- File upload for service photos using `multer`
- Uses MySQL (mysql2) as database

## Requirements
1. Create a database using mysql. This will be used later in .env file for node to create the schema

## Setup
1. Copy `.env.example` to `.env` and set DB credentials and JWT_SECRET_KEY.

2. Install dependencies:

```bash
cd attente_backend
npm install
```

3. Start the server

```bash
npm run dev
```
This command creates the tables in the database