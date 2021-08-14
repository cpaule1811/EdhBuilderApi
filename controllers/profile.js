const handleProfile = (req, res, db) => { 
    const { userID } = req.params;
    db('users').select(['userID', 'username', 'profile']).where('userID', userID)
    .then(user => {
        if (user.length) { 
            res.json(user[0]);
        }
        else  {
            res.status(400).json('User not found')
        }
    })
    .catch(err => {res.status(400).json('error getting user')})
}

module.exports = { 
    handleProfile: handleProfile
}