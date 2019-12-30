import jwt from 'jsonwebtoken'
const db = require('../config')

const generateToken = (user) => {
    return jwt.sign({ user }, db.SECRET_KEY, { expiresIn: '7 days' })
}

export { generateToken as default }