const handleMostRecent = (req, res, db) => {
    const { pn } = req.params; // page number

    db('users').select([{ userID: 'users.id' }, { deckID: 'decks.id' }, 'username', 'avg_rating', 'commander', 'name', 'description', 'partner', 'card_art', 'image_url', 'partner_image_url', 'image_url_2', 'color', 'artist'])
        .rightJoin('decks', 'users.id', '=', 'decks.user_id')
        .orderBy('decks.created', 'desc')
        .then(response => {
            const currentPageDecks = response.slice(8 * pn - 8, 8 * pn);
            const formattedCurrentPageDecks = currentPageDecks.map(deck => ({
                ...deck,
                avgRating: deck.avg_rating,
                deckName: deck.name,
                deckDescription: deck.description,
                cardArt: deck.card_art,
                cardImage: deck.image_url,
                cardImage2: deck.image_url_2,
                cardImagePartner: deck.partner_image_url,
                deckID: deck.id,
                userID: deck.user_id
            }))
            res.json(formattedCurrentPageDecks)
        })
        .catch(err => { res.status(400).json('unable to get decks') })
}

const getDecksLength = (req, res, db) => {
    db('decks')
        .count('id')
        .then(response => res.json(response[0]))
        .catch(err => res.status(400).json('unable to get number of decks'))
}

const handleMostRecentPriv = (req, res, db) => {
    const { pn, userid } = req.params

    db('users').select([{ userID: 'users.id' }, { deckID: 'decks.id' }, 'username', 'avgRating', 'commander', 'deckName', 'deckDescription', 'partner', 'cardArt', 'image_url', 'partner_image_url', 'image_url_2', 'color', 'artist'])
        .rightJoin('decks', 'users.id', '=', 'decks.user_id')
        .orderBy('decks.created', 'desc')
        .where('decks.user_id', '=', userid)
        .then(response => res.json(response.slice(8 * pn - 8, 8 * pn)))
        .catch(err => { res.status(400).json('unable to get decks') })
}

const getDecksLengthPriv = (req, res, db) => {
    const { userid } = req.params
    db('decks')
        .count('deck_id')
        .where('user_id', userid)
        .then(response => res.json(response[0]))
        .catch(err => res.status(400).json('unable to get number of decks'))
}

module.exports = {
    handleMostRecent: handleMostRecent,
    getDecksLength: getDecksLength,
    getDecksLengthPriv: getDecksLengthPriv,
    handleMostRecentPriv: handleMostRecentPriv
}

