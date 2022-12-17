const handleGetdeck = (req, res, db) => {
    const { id, userid } = req.params;
    const { userAttempt } = req;
    let userRating = 0;
    db('ratings')
        .select('rating')
        .where({ deck_id: id, user_id: userid })
        .then(data => userRating = data.length && data[0].rating)
    db('decks')
        .leftJoin('cards', 'decks.id', '=', 'cards.deck_id')
        .leftJoin('entrys', 'cards.cardName', '=', 'entrys.cardName')
        .select([{ id: 'decks.id' }, 'decks.color as commanderColor', 'decks.card_art as commanderArtCrop', '*'])
        .where('decks.id', '=', id)
        .then(decklist => {
            const deckdetails = {
                deckID: decklist[0].id,
                deckName: decklist[0].name,
                commander: decklist[0].commander,
                cardArt: decklist[0].commanderArtCrop,
                deckDescription: decklist[0].description,
                cardImage: decklist[0].image_url,
                userID: decklist[0].user_id,
                cardImage2: decklist[0].image_url_2,
                color: decklist[0].commanderColor,
                username: decklist[0].username,
                partner: decklist[0].partner,
                averageRating: decklist[0].averageRating,
                cardImagePartner: decklist[0].partner_image_url,
                excludedColors: ['B', 'U', 'G', 'R', 'W'].filter(item => !decklist[0].commanderColor.includes(item))
            };
            const deck = decklist.map(item => {
                return {
                    cardName: item.card_name,
                    deckID: item.deck_id,
                    quantity: item.quantity,
                    cardStatus: item.card_status,
                    type: item.type,
                    price: item.price,
                    cmc: item.cmc,
                    imageUrl: item.image_url,
                    modal: item.modal,
                    legal: item.legal,
                    imageUrl2: item.image_url_2,
                    color: item.color,
                    producedMana: item.produced_mana
                }
            })
            const authorized = decklist[0].user_id === userAttempt
            if (!deck[0].cardName) {
                deck.pop()
            }
            const data = [
                deckdetails,
                deck.filter(item => item.cardStatus === "main"),
                deck.filter(item => item.cardStatus === "sideboard"),
                authorized
            ]
            res.json(data)
        })
}

module.exports = {
    handleGetdeck: handleGetdeck
}