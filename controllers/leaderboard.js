const handleLeaderboard = (req, res, db) => { 
     db('decks')
     .select(['decks.id', 'deckName', 'commander', 'deckDescription', 'decks.user_id',
      'partner', 'cardArt', 'avgRating', 'username', 'artist'])
    .join('users', 'users.id', '=', "decks.user_id")
     .orderBy('avgRating', 'desc')
     .limit(5)
     .then(data => {
         db.raw(`SELECT "id", "deckName", "commander", "deckDescription", decks.user_id",
         "partner", "cardArt", "avgRating", username, artist
          FROM decks 
          JOIN users ON users.id = decks.user_id
          WHERE decks."created" BETWEEN NOW() - INTERVAL '1 month' AND NOW() order by "avgRating" desc limit 5;`)
         .then(dataMonths => {
             res.json([data, dataMonths.rows])
         })
         .catch(err => {
            console.log("err:", err)
         })
     })
     .catch(err => {
        console.log("err:", err)
     })
}

module.exports = { 
    handleLeaderboard: handleLeaderboard
}