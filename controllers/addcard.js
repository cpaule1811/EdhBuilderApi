const handleAddcard = (req, res, db) => {
    const { deckID, cardName, quantity } = req.body;
    db('cards').insert({
        card_name: cardName,
        quantity: quantity,
        deck_id: deckID,
        card_status: "main"
    })
        .onConflict(['card_name', 'deck_id'])
        .merge({ quantity: quantity })
        .returning(['card_name', 'deck_id'])
        .then(addedCard => {
            const { card_name, deck_id } = addedCard[0]
            db('entrys').join('cards', 'cards.card_name', '=', 'entrys.card_name').select("*")
                .where({ "entrys.card_name": card_name, deck_id: deck_id })
                .then(data => {
                    const entry = data[0];
                    const card = {
                        cardName: entry.card_name,
                        cardImage: entry.image_url,
                        cardImage2: entry.image_url_2,
                        producedMana: entry.produced_mana,
                        cardArt: entry.card_art,
                        type: entry.type,
                        modal: entry.modal,
                        legal: entry.legal,
                        cmc: entry.cmc,
                        oracleText: entry.oracle_text,
                        price: entry.price,
                        artist: entry.artist
                    }
                    res.json({ card: card[0], resp: true })
                })
        })
        .catch(() => { res.status(400).json('unable to add card to deck') })
}

module.exports = {
    handleAddcard: handleAddcard
}