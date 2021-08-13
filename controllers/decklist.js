const handleDecklist = (req, res, db) => { 
    const { deckID } = req.params; 
    db.select('*').from("decks").join('cards', 'cards.deckID', 'decks.deckID').where('cards.deckID', deckID)
    .then(decklist => {
        res.json(decklist);
    })
    .catch(err => res.status(400).json('error getting decklist'))
}

module.exports = { 
    handleDecklist: handleDecklist
}