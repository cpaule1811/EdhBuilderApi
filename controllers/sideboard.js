const handleSideboard = (req, res, db) => { 
    const { cardName, deckID, status } = req.body;
    db('cards').returning('*').update({cardStatus: status}).where({cardName: cardName, deckID: deckID})
    .then(response => { 
        const { cardName, deckID } = response[0]
        db('entrys').join('cards', 'cards.cardName', '=', 'entrys.cardName').select("*").where({ "entrys.cardName": cardName, deckID: deckID })
        .then(card => {
            res.json(card[0])
        })
    })
}

module.exports = {
    handleSideboard: handleSideboard
}