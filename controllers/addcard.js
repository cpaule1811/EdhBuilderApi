const handleAddcard = (req, res, db) => { 
    const { deckID, cardName, quantity } = req.body;
    db('cards').insert({ 
        cardName: cardName, 
        quantity: quantity, 
        deckID: deckID,
        cardStatus: "main"
    })
    .onConflict(['cardName', 'deckID'])
    .merge({ quantity: quantity })
    .returning(['cardName', 'deckID'])
    .then(addedCard => {
        const { cardName, deckID } = addedCard[0]
        db('entrys').join('cards', 'cards.cardName', '=', 'entrys.cardName').select("*").where({ "entrys.cardName": cardName, deckID: deckID })
        .then(card => {
            res.json({card: card[0], resp: true})
        })
    })  
    .catch(() => { res.status(400).json('unable to add card to deck') })
}

module.exports = { 
    handleAddcard: handleAddcard
}