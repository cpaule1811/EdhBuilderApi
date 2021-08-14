const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client('950586625282-75oevgl4tfineao69jso6bsh0pio9v69.apps.googleusercontent.com')

const handleSigninGoogle = async (req, res, db) => { 
    const { token } = req.body
    const ticket = await client.verifyIdToken({
        idToken: authorization,
        audience: process.env.CLIENT_ID
    });
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
    .returning(['userID'])
     
    res.json(user)
}

module.exports = { 
    handleSigninGoogle: handleSigninGoogle
 }