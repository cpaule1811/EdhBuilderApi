const redisClient = require('./signin').redisClient

const handleForgot = (req, res, db, nodemailer) => { 
    const { email } = req.body
    db('users')
    .select('email')
    .where({email: email})
    .then(email => { 
            if (email[0]){
             const ukey = randomString(20)
             redisClient.set(ukey, email[0].email, 'EX', 60 * 15)
             return { ukey: ukey, email: email[0].email }
            }
        })
        .then(resp => { 
            if(!resp.email) {
              return res.status(err).json("could not find user with that email address");
            }
            let transporter = nodemailer.createTransport({ 
                host: 'smtp.gmail.com',
                port: 465,
                secure:true,
                auth: {
                    type: 'OAuth2',
                    user: process.env.FORGOT_EMAIL,
                    clientId: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_SECRET,
                    refreshToken: process.env.GOOGLE_REFRESH,
                    accessToken: process.env.GOOGLE_ACCESS,
                    expires: 1484314697598
                }
                })
                const mail = { 
                    from: `EDH Builder`,
                        to: resp.email,
                        subject: "EDH Builder Reset Password",
                        text: `Click this link to register new password: https://edhbuilder.com.au/forgotpassword${resp.ukey}`,
                }
                transporter.sendMail(mail, (err, info) => {
                    if (err) { 
                        return res.status(400).json("could not send email")
                    }
                    else { 
                        return res.json("Please check email for link to password reset form")
                    }
                }) 
    })
    .catch(err => res.status(400).json(err))
    }

    function randomString(len) {
        charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var randomString = '';
        for (var i = 0; i < len; i++) {
            var randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz,randomPoz+1);
        }
        return randomString;
    }


module.exports = { 
   handleForgot: handleForgot
}