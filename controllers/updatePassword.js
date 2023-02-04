const redisClient = require('../redisClient')

const handleValidUnique = (req, res) => {
    const { authorization } = req.headers
    redisClient.get(authorization, (err, reply) => {
        if (err || !reply) {
            return res.status(401).json('unauthorized')
        }
        return res.json('valid')
    })
}

const handleUpdatePassword = (req, res, db, bcrypt) => {
    const { authorization } = req.headers
    redisClient.get(authorization, (err, reply) => {
        if (err || !reply) {
            return res.status(400).json('unauthorized')
        }
        const { password } = req.body;
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds).then(hash => {
            db('login')
                .update({ hash: hash })
                .where('email', reply)
                .then(resp => {
                    if (resp === 1) {
                        redisClient.del(authorization)
                        return res.json('success')
                    }
                })
                .catch(err => res.status(400).json('Could not reset password'))
        })
            .catch(err => res.status(400).json('Could not reset password'))
    })
}

module.exports = {
    handleUpdatePassword: handleUpdatePassword,
    handleValidUnique: handleValidUnique
}