const jwt = require('jsonwebtoken')

const isTokenValid = (role) => (req, res, next) => {
    try {
       
        let token = req.get('Authorization')
   
        if (!token) {
            return res.status(404).json({
                message: 'No token provided.',
            })
        }

        token = token.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
       
        if (decoded.role !== role) {
            throw {
                code: 401,
                message:
                        'Do not have authorization to access this resource',
                }
            }
        req.email = decoded.email
        req.id = decoded.id
        next()
    } catch (error) {
        next(error)
    }
}

const refreshToken = (email, token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH)
        return {
            email: decoded.email,
            id_users: decoded.user_id,
            role: decoded.role.role,
        }
    } catch (error) {
        return false
    }
}

module.exports = {
    isTokenValid,
    refreshToken,
}
