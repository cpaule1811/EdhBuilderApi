const redisClient = require('./signin').redisClient

const requireAuth = (req, res, next) => { 
    const { authorization } = req.headers;
    if (!authorization) { 
        return res.status(401).json('unauthorized')
    }
    return redisClient.get(authorization, (err, reply) => { 
        if(err || !reply) { 
            return res.status(401).json('unauthorized')
        }
        return next()
    })
}

const requireAuthDecklist = (req, res, next) => { 
    const { authorization } = req.headers;
    req.userAttempt = "not a user"
    if (!authorization) { 
        return next()
    }
    return redisClient.get(authorization, (err, reply) => { 
        if(err || !reply) { 
            return next()
        }
        req.userAttempt = Number(reply)
        return next()
    })
}

const requireAuthEdit = (db) => (req, res, next) => { 
    const { authorization } = req.headers;
    const { deckID } = req.body;
    if (!authorization) { 
        return res.status(401).json('unauthorized')
    }
    return redisClient.get(authorization, (err, reply) => { 
        if(err || !reply) { 
            return res.status(401).json('unauthorized')
        }
        db('decks').select('user_id').where('id', deckID)
        .then(resp => {
           if(resp[0].userID === Number(reply)){
             return next()
           } 
           else { 
            return res.status(401).json('unauthorized')
           }
        })
    })
}

const requireAuthAdmin = (req, res, next) => { 
    const { authorization } = req.headers;
    if (!authorization) { 
        return res.status(401).json('unauthorized')
    }
    return redisClient.get(authorization, (err, reply) => { 
        if(err || !reply || reply !== process.env.ADMIN) { 
            return res.status(401).json('unauthorized')
        }
        return next()
    })
}

module.exports = { 
    requireAuth: requireAuth,
    requireAuthDecklist: requireAuthDecklist,
    requireAuthEdit: requireAuthEdit,
    requireAuthAdmin: requireAuthAdmin
}