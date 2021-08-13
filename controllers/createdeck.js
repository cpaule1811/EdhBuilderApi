const handleCreatedeck = (req, res, db) => { 
    const { deckName, commander, deckDescription, partner, userID } = req.body;
    if (!deckName || !commander || !userID){ 
        res.status(400).json(err)
    }
    db('entrys').select('*').whereIn("cardName", [commander, partner])
    .then(commanderData => {
                const { cardName, imageUrl, imageUrl2, cardArt, color } = commanderData[0]
                db('decks').insert({ 
                    deckName: deckName,
                    commander: cardName,
                    deckDescription: deckDescription, 
                    partner: commanderData[1] ? commanderData[1].cardName : null,
                    userID: userID,
                    created: new Date(),
                    cardImage: imageUrl,
                    cardArt: cardArt,
                    cardImagePartner: commanderData[1] ? commanderData[1].imageUrl: null,
                    cardImage2: imageUrl2, 
                    color: color,
                    avgRating: 0.00
                })
                .returning('*')
                .then(resp => {res.json(resp[0].deckID); console.log(resp)})
        
    })
        .catch(err => res.status(400).json(err))  
}



module.exports = { 
    handleCreatedeck: handleCreatedeck
}