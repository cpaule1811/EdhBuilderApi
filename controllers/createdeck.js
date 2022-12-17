const handleCreatedeck = (req, res, db) => {
    const { deckName, commander, deckDescription, partner, userID } = req.body;
    if (!deckName || !commander || !userID) {
        res.status(400).json(err)
    }
    db('entrys').select('*').whereIn("card_name", [commander, partner])
        .then(commanderData => {
            const { cardName, imageUrl, imageUrl2, cardArt, color, artist } = commanderData[0]
            db('decks').insert({
                name: deckName,
                commander: cardName,
                description: deckDescription,
                partner: commanderData[1] ? commanderData[1].cardName : null,
                user_id: userID,
                created: new Date(),
                image_url: imageUrl,
                card_art: cardArt,
                partner_image_url: commanderData[1] ? commanderData[1].imageUrl : null,
                image_url_2: imageUrl2,
                color: color,
                artist: artist,
            })
                .returning('*')
                .then(resp => { res.json(resp[0].deck_id) })
        })
        .catch(err => res.status(400).json(err))
}



module.exports = {
    handleCreatedeck: handleCreatedeck
}