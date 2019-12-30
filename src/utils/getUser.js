import jwt from 'jsonwebtoken'
const db = require('../config')

const getUser = async token => {
    if (token) {
        try {
            return await jwt.verify(token, db.SECRET_KEY);
        } catch (err) {
            throw new Error(
                "Your session has ended. Please sign in again."
            )
        }
    }
};

export { getUser as default }