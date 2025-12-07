# CapBio Backend

Simple Node/Express + Sequelize backend for posts and messages.

## Features
- Sequelize models for `post` and `message` tables
- `POST` and `GET` endpoints for `/post` and `/message`
- File upload for post photos using `multer`
- Uses MySQL (mysql2) as database

## Setup
1. Copy `.env.example` to `.env` and set DB credentials.

2. Install dependencies:

```bash
cd backend
npm install
```

3. Start the server

```bash
npm run dev
```

4. Make requests:
- GET /post
- POST /post (multipart/form-data with fields `title`, `description`, `date` (optional), `photo`)
- GET /message
- POST /message (JSON: `full_name`, `email`, `subject`, `message`)

Notes:
- Files uploaded to `/uploads` folder and served statically from `/<UPLOADS_DIR>`
- The database tables are created automatically using `sequelize.sync()` with `alter: true`.
- No authentication implemented.

- Server uses Multer 2

# 🖼️ Image Uploads & Static File Handling — Fix Documentation

This document explains how the static file problem for **image uploads and image display** was fixed on the server.

---

## ✅ Problem Summary

Uploaded images were not displaying on the frontend because the backend was serving them from a directory that was **not publicly accessible**. The upload path used by the API did not match the path served by Apache.

---

## ✅ Final Working Solution

### **1. Move the `uploads` Folder to `public_html`**

Apache only serves files inside `public_html`.  
So the solution is to place uploaded images where Apache can access them.

```
/home/capbiobi/public_html/uploads
```

Now images in this folder can be accessed directly:

```
https://capbio.bi/uploads/<filename>
```

---

### **2. Update `.env` to Reflect the New Upload Path**

Add:

```
UPLOADS_DIR=/home/capbiobi/public_html/uploads
```

This ensures the backend saves uploaded files directly inside the public web directory.

---

### **3. Remove/Ignore Old Express Static Mapping**

Previously, the backend attempted to serve files using Express:

```js
app.use('/uploads', express.static(path.join(__dirname, '../public_html/uploads')));
```

This is **no longer necessary** because Apache serves the files automatically.

The API now only needs to return correct URLs pointing to Apache's public folder.

---

### **4. Update the Upload Code to Point to the New Path**

Inside your upload logic:

```js
const photoPath = `/uploads/${filename}`;
```

The frontend can now load images directly:

```jsx
<img src={`https://capbio.bi${photoPath}`} />
```

---

## ✅ Result

- Uploads now correctly land inside `public_html/uploads`.
- Apache automatically serves all uploaded images.
- Frontend can access images without CORS or static path issues.
- No need for Express to serve static files.

---

## 📌 Notes

- Apache must have permission to read the `uploads` folder.
- Filenames should be sanitized.
- Ensure the API always returns a correct public URL.