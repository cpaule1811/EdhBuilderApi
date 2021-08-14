const handleRemovecard = (req, res, db) => { 
    const { deckID, cardName } = req.body;
        db('cards')
        .returning('cardName')
        .where({ cardName: cardName, deckID: deckID })
        .del()
        .then(response =>  res.json(response[0])) 
        .catch(err => {res.status(400).json('unable to delete from deck')})
}


module.exports = { 
    handleRemovecard: handleRemovecard
}

