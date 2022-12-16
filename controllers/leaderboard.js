const handleLeaderboard = (req, res, db) => { 
     db('decks')
     .select(['deckID', 'deckName', 'commander', 'deckDescription', 'decks.userID',
      'partner', 'cardArt', 'avgRating', 'username', 'artist'])
    .join('users', 'users.userID', '=', "decks.userID")
     .orderBy('avgRating', 'desc')
     .limit(5)
     .then(data => {
         db.raw(`SELECT "deckID", "deckName", "commander", "deckDescription", decks."userID",
         "partner", "cardArt", "avgRating", username, artist
          FROM decks 
          JOIN users ON users."userID" = decks."userID"
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