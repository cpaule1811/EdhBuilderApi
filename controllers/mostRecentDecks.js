const handleMostRecent = (req, res, db) => { 
    const { pn } = req.params  
    
    db('users').select([{userID: 'users.userID'}, {deckID: 'decks.deckID'}, 'username', 'avgRating', 'commander', 'deckName', 'deckDescription', 'partner', 'cardArt', 'cardImage', 'cardImagePartner', 'cardImage2', 'color', 'artist'])
    .rightJoin('decks', 'users.userID', '=', 'decks.userID')
    .orderBy('decks.created', 'desc')
    .then(response => res.json(response.slice(8*pn-8, 8*pn)))
    .catch(err => {res.status(400).json('unable to get decks')})
}

const getDecksLength = (req, res, db) => {
    db('decks')
    .count('deckID')
    .then(response => res.json(response[0]))
    .catch(err => res.status(400).json('unable to get number of decks'))
}

const handleMostRecentPriv = (req, res, db) => { 
    const { pn, userid } = req.params
        
    db('users').select([{userID: 'users.userID'}, {deckID: 'decks.deckID'}, 'username','avgRating', 'commander', 'deckName', 'deckDescription', 'partner', 'cardArt', 'cardImage', 'cardImagePartner', 'cardImage2', 'color', 'artist'])
    .rightJoin('decks', 'users.userID', '=', 'decks.userID')
    .orderBy('decks.created', 'desc')
    .where('decks.userID', '=', userid)
    .then(response => res.json(response.slice(8*pn-8, 8*pn)) )
    .catch(err => {res.status(400).json('unable to get decks')})
}

const getDecksLengthPriv = (req, res, db) => {
    const { userid } = req.params
    db('decks')
    .count('deckID')
    .where('userID', userid)
    .then(response => res.json(response[0]))
    .catch(err => res.status(400).json('unable to get number of decks'))
}

module.exports = { 
    handleMostRecent: handleMostRecent,
    getDecksLength: getDecksLength,
    getDecksLengthPriv: getDecksLengthPriv,
    handleMostRecentPriv: handleMostRecentPriv
}

