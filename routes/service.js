const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const { Service } = require('../models')
require('dotenv').config()

const UPLOADS_DIR = process.env.UPLOADS_DIR || 'uploads'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR)
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    const timestamp = Date.now()
    cb(null, `serv_${timestamp}${ext}`)
  }
})


const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } })

// GET /service - list service
router.get('/', async (req, res) => {
  try{
    const service = await Service.findAll({ order: [['created_at', 'DESC']] })
    res.json(service)
  }catch(err){
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch services' })
  }
})

// POST /service - create service (multipart/form-data)
router.post('/', upload.single('image'), async (req, res) => {
  try{
    const { name, description } = req.body
    if (!name || !description) return res.status(400).json({ error: 'Tous les champs sont requis.' })
    let photoPath = null
    if (req.file) {
      photoPath = `uploads/${req.file.filename}`
    }
    const serv = await Service.create({ name, description, image: photoPath, created_at: new Date() })
    res.status(201).json(serv)
  }catch(err){
    console.error(err)
    res.status(500).json({ error: 'La création de la publication a échouée.' })
  }
})

module.exports = router
