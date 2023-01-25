//update is going to change the profile picturekn

const handleUsername = (req, res, db) => {
    const { userId, username, profile } = req.body
    db("users").where("id", userId)
        .update({
            username: username,
            profile: profile
        }).returning('*')
        .then(data => {
            const userData = data[0];
            res.json({ ...userData, userID: userData.id })
        })
}

module.exports = {
    handleUsername: handleUsername
}