//update is going to change the profile picturekn

const handleUsername = (req, res, db) => { 
    const { userId, username, profile } = req.body
    db("users").where("userID", userId)
    .update({
        username: username,
        profile: profile
    }).returning('*')
    .then(data => { 
        res.json(data[0])
    })
}

module.exports = { 
    handleUsername: handleUsername
 }