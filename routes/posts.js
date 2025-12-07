const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const { Post } = require('../models')
require('dotenv').config()

const UPLOADS_DIR = process.env.UPLOADS_DIR || 'uploads'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR)
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    const timestamp = Date.now()
    cb(null, `capbio_${timestamp}${ext}`)
  }
})


const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } })

// GET /post - list posts
router.get('/', async (req, res) => {
  try{
    const posts = await Post.findAll({ order: [['created_at', 'DESC']] })
    res.json(posts)
  }catch(err){
    console.error(err)
    res.status(500).json({ error: 'Impossible de récupérer les publications.' })
  }
})

// POST /post - create a post (multipart/form-data)
router.post('/', upload.single('photo'), async (req, res) => {
  try{
    const { title, description, date } = req.body
    if (!title || !description) return res.status(400).json({ error: 'Tous les champs sont requis.' })
    let photoPath = null
    if (req.file) {
      photoPath = `uploads/${req.file.filename}`
    }
    const post = await Post.create({ title, description, photo: photoPath, created_at: date || new Date() })
    res.status(201).json(post)
  }catch(err){
    console.error(err)
    res.status(500).json({ error: 'La création de la publication a échouée.' })
  }
})

module.exports = router
