const handleEditdeck = (req, res, db) => {
    const { deckName, commander, deckDescription, partner } = req.body;
    const { deckID } = req.params;
    db('entrys').select('*').whereIn("cardName", [commander, partner ? partner : ""])
        .then(commanderData => {
            const { cardName, imageUrl, imageUrl2, cardArt, color, artist } = commanderData[0]
            db('decks')
                .where("id", deckID)
                .update({
                    name: deckName,
                    commander: cardName,
                    description: deckDescription,
                    partner: commanderData[1] ? commanderData[1].cardName : null,
                    image_url: imageUrl,
                    card_rt: cardArt,
                    partner_image_url: commanderData[1] ? commanderData[1].imageUrl : null,
                    image_url_2: imageUrl2,
                    color: color,
                    artist: artist,
                })
                .returning('*')
                .then(resp => { res.json(resp[0].id) })
        })
        .catch(err => res.status(400).json(err))
}

module.exports = {
    handleEditdeck: handleEditdeck
}