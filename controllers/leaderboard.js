const handleLeaderboard = (req, res, db) => {
    db('decks')
        .select(['decks.id', 'name', 'commander', 'description', 'decks.user_id',
            'partner', 'card_art', 'avg_rating', 'username', 'artist'])
        .join('users', 'users.id', '=', "decks.user_id")
        .orderBy('avg_rating', 'desc')
        .limit(5)
        .then(data => {
            db.raw(`SELECT users.id, name, commander, description, decks.user_id,
         partner, card_art, avg_rating, username, artist
          FROM decks 
          JOIN users ON users.id = decks.user_id
          WHERE decks."created" BETWEEN NOW() - INTERVAL '1 month' AND NOW() order by "avg_rating" desc limit 5;`)
                .then(dataMonths => {
                    const dataMonthsFormatted = formatDecks(dataMonths.rows)
                    const dataFormatted = formatDecks(data)

                    res.json([dataFormatted, dataMonthsFormatted])
                })
                .catch(err => {
                    console.log("err:", err)
                })
        })
        .catch(err => {
            console.log("err:", err)
        })
}

const formatDecks = (decks) => decks.map(deck => ({
    avgRating: deck.avg_rating,
    deckName: deck.name,
    deckDescription: deck.description,
    cardArt: deck.card_art,
    deckID: deck.id,
    userID: deck.user_id,
    commander: deck.commander,
    partner: deck.partner,
    artist: deck.artist,
    username: deck.username
}));

module.exports = {
    handleLeaderboard: handleLeaderboard
}