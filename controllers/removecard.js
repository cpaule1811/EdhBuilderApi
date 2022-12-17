const handleRemovecard = (req, res, db) => {
    const { deckID, cardName } = req.body;
    db('cards')
        .returning('card_name')
        .where({ card_name: cardName, deck_id: deckID })
        .del()
        .then(response => res.json(response[0]))
        .catch(err => { res.status(400).json('unable to delete from deck') })
}


module.exports = {
    handleRemovecard: handleRemovecard
}

