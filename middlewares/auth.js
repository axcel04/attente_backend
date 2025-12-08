const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

module.exports = {
  authRequired: (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ error: "Unauthorized" })

    const token = authHeader.split(" ")[1]

    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      req.user = decoded
      next()
    } catch {
      return res.status(401).json({ error: "Invalid token" })
    }
  },

  requireRole: (...roles) => {
    return (req, res, next) => {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" })

      if (!roles.includes(req.user.role))
        return res.status(403).json({ error: "Forbidden: insufficient rights" })

      next()
    }
  }
}
