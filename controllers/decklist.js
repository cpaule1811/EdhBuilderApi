const handleDecklist = (req, res, db) => { 
    const { deckID } = req.params; 
    db.select('*').from("decks").join('cards', 'cards.deck_id', 'decks.id').where('cards.deck_id', deckID)
    .then(decklist => {
        res.json(decklist);
    })
    .catch(err => res.status(400).json('error getting decklist'))
}

module.exports = { 
    handleDecklist: handleDecklist
}