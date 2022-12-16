const jwt = require('jsonwebtoken');
const redis = require("redis");
const redisClient = redis.createClient({  
    url: process.env.REDIS_URL
});

redisClient.on("error", function(error) {
    console.error(error);
});

const { OAuth2Client } = require('google-auth-library')
const googleClient = new OAuth2Client(process.env.GOOGLE_API_KEY)

const handleSigninGoogle = async (req, res, db, token) => {
    const ticket = await googleClient.verifyIdToken(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_SECRET
    );
    const { email } = ticket.getPayload();    
    const [user] = await db("users")
    .insert({
        email: email, 
        decksNum: 0,
        joined: new Date(),
        profile: 'data:image/png;base64,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'
    })
    .onConflict("email")
    .merge(["email"])
    .returning('*')
    return user
}

const handleSignin = (req, res, db, bcrypt) => { 
    const { email, password } = req.body;
    if(!email || !password) { 
        return Promise.reject('Please enter your username and password')
    }
    return db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => { 
        return bcrypt.compare(password, data[0].hash).then(isValid => {
        if (isValid) { 
            return db.select('*').from('users')
            .where('email', '=', email)
            .then(user => user[0])
            .catch(() => Promise.reject('unable to get user'))
        }
        else { 
            return Promise.reject('Invalid username or password');
        }
       })
    })
    .catch(() => Promise.reject('Invalid username or password'));
}

const getAuthTokenId = (req, res) => {
    const { authorization } = req.headers
    return redisClient.get(authorization, (err, reply) => { 
        if (err || !reply) { 
            console.log(err)
            return res.status(400).json('unauthorized')
        }
        return res.json({userID: reply})
    })
}

const signToken = (username, email) => { 
    const jwtPayload = { username, email }
    return jwt.sign(jwtPayload, process.env.SECRET_JWT)
}

const setToken = (token, userID) => { 
    return Promise.resolve(redisClient.set(token, userID, 'EX', 259200))
}

const createSessions = (user) => { 
    const { username, userID, email } = user; 
    const token = signToken(username, email);
    return setToken(token, userID)
    .then(() => { return { success: 'true', userID: userID, token } })
    .catch(console.log)
}

const signinAuthentication = (db, bcrypt) => (req, res) => { 
    const { authorization, token } = req.headers
    return authorization ? getAuthTokenId(req, res) : 
        (token ? handleSigninGoogle(req, res, db, token) : handleSignin(req, res, db, bcrypt))
       .then(user => {
         return user.userID && user.email ? createSessions(user) : Promise.reject(user)
       })
       .then(session => res.json(session))
       .catch(err => res.status(400).json(err))
}

const handleRegister = (req, res, db, bcrypt) => { 
    const { email, username, password } = req.body; 
    if(!email, !username) { 
         return Promise.reject('Please make sure all fields are filled out')
    }
    if (password.length < 8 || password.length > 20 )  {
        return Promise.reject('Password must be between 8 and 20 characters')
    }
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds).then(hash => { 
       return db.transaction(trx => { 
           trx.insert({ 
               hash: hash, 
               email: email
           })
           .into('login')
           .returning('email')
           .then(loginEmail => { 
               return db('users')
               .returning("*")
               .insert({
                   email: loginEmail[0], 
                   username: username, 
                   decksNum: 0,
                   joined: new Date(),
                   profile: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAFtklEQVRogc2ZWWyUVRTHf/djtm7TFVqobaFAaaWgQEurLyqyJbigPIAoxMREiQlLDA2vJCaGIComPhgREiQSxQAJD4TFYEwkAt1spGVpIXTBFkqnLTNDO52W48M4hU47tN+dKfX3Nvc759z//e7Nd885o4gCIpIBLAFKgHwgF0gF4v8z8QAdwE3gKnAB+E0p1RaN+bUQkVQR2SIi5aLPJRHZLCKpT1P4MyKyV0S8EQgPxSMiX4lI5ngKt4rIVhFxR1F4KF4R2Ski9miLnyMif42j8FCqRSQvWuLXyPi+9XDcF5G3IhX/voj4J0B8kH4R2aQr/qMJFB7KZrPi10hg9f8X+kVk9Uha1QjiZwGVgFNr68YPD1CslLr6+OCQBYiIDbgEPBfpbP2+ATwdvQDEpTiwOiZFGhKgGihRSvmDA5YQg0+IQHzv/T5qTzdyq7yNzhbPkGcp2QnkFKVTuHI69nir7hQLgK3AnuDA4A5I4Ba8BsTpRK493UjFz9fx9/Y/0c4Wa6F43RwKlmbrTAOBo5SnlGoFMB57UIaOeIE/9l/mz4N1o4oH6HvQz/kDtZw/UAtiejYIJIjbgz8UBBIzoAmINRut6mgDVUfrtZQUrc3j+Tdn6rh6gRylVEdwB95FQ7yryU31sQYdAQBUHqnH1ejWcY0D1sGjI7RBJ0rFkeuI6J0DABGhUnP3gI0AhohMBRaZ9fZ5/LTUtOtOPkhz9V36HvhHNxxOsYikG8ArjHChjUbrFRcPB/TffpCHA0JrnUvHVQEvGwTKQNN42nt03EbEfU87VqlBoIY1jd83+idzzLF6tGPNMYBZOp4xzugVTbFJ2rFmG0CSjmdSZvzoRuMfK8ngUevDFOl5STgSbLoTDxLjtDFlltY7BEgwRrcZGWUoCpZm6boPUrAsG2WY/ggOYhBIjrSY/1puJOeXuBQH81bN0PYH3AbQqettjbGwvGwRFpv5XH+S1eDVbQuwOkIzelN0GcCNSCKkzUhk+fZFpnJ8e7yVlTuKIjn7QeqViHwNbIk0kru9h/KfrnHzQmv4NFnBzBemUrxuDvFpMZFOCbBXicg7wOFoRAPobvPSWH6HO/Vd9HT5AIhJspOel8z04nSc6aaT3iexVolIOtCKRj40wQgw1VBK3QEqJlqNBheVUneC98ChCZWixyEYWlI2olnQhyOY59titbsQ4RgsKS0ASqkOEdkHbNOJ5vP6uf33Pf6p7aCz2UNni2dYkWKPs5KUGU9yVjyZhWlkzkuNZGHfKqU6IJK2isDty/e48msTTVV3TRc3xiRF9sIpFCzLIXNuqplPiJtAW6VtyAIARGQHsGu0CHcburj041Xarmlf4kOYnJtIyXv5ZOSnjMV8u1Lqi+CP0AVYgYsEOmDD6PcNcOHQFa6ea45Eb1jyl2RRuqEAiz1salIFlD7eWhxzc7e71cuZPZV0t3qjKHk4iVPjWF62iMSMYSfZAxQppa49PjjiyZPAPyO/AJMgcGTOfF5Jr7tvHCQPx+G0saKsiMkzE4NDA8DbSqkTobYj1gNKqePAxwCdLR5O7ap4auIh0CQ++dmlYNNLgE0jiYcwCwBQSn3X6/Z/eHp3hW7fJiL8Pf2c/bISn8e/RSn1fTi7J1ZkMU7bvtzSjJ22GGvkDSCTWB0WyV6Q/qkjwfbNk+zG9PW9cLhu2e2ajuOuJndUb+pwpE13eqfNS3ujZH3+udFsx3x91J+stzc1eI40V7e/7u/tH5fM1RZjkemLM87mzk9enfVi1pi6XaaF1BxrKGy70XWwtda1wO+LzkKsDotMm5talTbLuXHh6tl1Zny1BdScuDXD1dS9u7PFvcLV5E4w26VWSpGak+BOzko4NSUnoezZVbmNOjqi8gbLf6gr9PkffvCgs/elnvv+rJ4un7PP67cGd8hqt4gt3uqPTbR12xNtzXHJjt9tDrV/8fq5tZHO/S+NxXaYAKX2kQAAAABJRU5ErkJggg=="
               })
               .then(user => user[0])
               .catch(Promise.reject('Looks like a user with that email address already exists'))
           })
           .then(trx.commit)
           .catch(trx.rollback)
       })  
       .catch(err => Promise.reject('Looks like a user with that email address already exists')); 
    })
}

const registerAuthentication = (db, bcrypt) => (req, res) => { 
       handleRegister(req, res, db, bcrypt)
       .then(user => {
       return user.userID && user.email ? createSessions(user) : Promise.reject(user)
       })
       .then(session => res.json(session))
       .catch(err => res.status(400).json(err))
}

const signout = (req,res) => { 
     const { authorization } = req.headers;
     redisClient.del(authorization, (err, result) => {
         if(err) { 
             return res.json(err);
         }
         return res.json(result)
     })
}

module.exports = { 
    registerAuthentication: registerAuthentication,
    signinAuthentication: signinAuthentication,
    handleSignin: handleSignin,
    redisClient: redisClient,
    signout: signout
 }