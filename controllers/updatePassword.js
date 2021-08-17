const redisClient = require('./signin').redisClient

const handleUpdatePassword = (req, res, db, bcrypt) => { 
    const { authorization } = req.headers
    redisClient.get(authorization, (err, reply) => { 
        if (err || !reply) { 
            res.status(400).json('unauthorized')
        }
    })
    .then(email => {
        const { password } = req.body; 
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds).then(hash => { 
            db('login')
            .update({hash: hash})
            .where('email', email)
            .then(resp => { 
                if (resp === 1) { 
                    res.json('success')
                }
            })
        })
        .catch(err => res.status(400).json('Could not reset password'))
    })
}

module.exports= { 
    handleUpdatePassword: handleUpdatePassword
}