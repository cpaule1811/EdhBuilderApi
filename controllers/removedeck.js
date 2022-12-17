const handleRemovedeck = (req, res, db) => {
    const { deckID } = req.params;
    db.transaction(trx => {
        trx.del()
            .from('decks')
            .where('id', deckID)
            .returning('user_id')
            .then(response => {
                res.json(response)
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(err => res.status(400).json('unable to remove card from deck'))
}

module.exports = {
    handleRemovedeck: handleRemovedeck
}
