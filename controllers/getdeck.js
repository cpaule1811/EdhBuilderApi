const handleGetdeck = (req, res, db) => { 
     const { id, userid } = req.params;
     const { userAttempt } = req;
     let userRating = 0;
     db('ratings')
    .select('rating')
    .where({deckID: id, userID: userid })
    .then(data => userRating = data.length && data[0].rating)
            db('decks')
            .leftJoin('cards', 'decks.deckID', '=', 'cards.deckID')
            .leftJoin('entrys', 'cards.cardName', '=', 'entrys.cardName')
            .select([{deckId: 'decks.deckID'}, 'decks.color as commanderColor', 'decks.cardArt as commCardArt', '*'])
            .where('decks.deckID', '=', id)
            .then(decklist => { 
                    const deckdetails = { 
                        deckID: decklist[0].deckId,
                        deckName: decklist[0].deckName,
                        commander: decklist[0].commander,
                        cardArt: decklist[0].commCardArt,
                        description: decklist[0].deckDescription,
                        cardImage: decklist[0].cardImage,
                        userID: decklist[0].userID,
                        cardImage2: decklist[0].cardImage2, 
                        color: decklist[0].commanderColor, 
                        username: decklist[0].username,
                        partner: decklist[0].partner,
                        cardImagePartner: decklist[0].cardImagePartner,
                        userRating: userRating ? userRating = userRating : null,
                        avgRating: decklist[0].avgRating,
                        excludedColors: ['B', 'U', 'G', 'R', 'W'].filter(item => !decklist[0].commanderColor.includes(item))
                    }; 
                    const deck = decklist.map(item => { 
                        return {
                        cardName: item.cardName,
                        deckID: item.deckID,
                        quantity: item.quantity, 
                        cardStatus: item.cardStatus,
                        type: item.type, 
                        price: item.price, 
                        cmc: item.cmc, 
                        imageUrl: item.imageUrl, 
                        modal: item.modal, 
                        legal: item.legal, 
                        imageUrl2: item.imageUrl2, 
                        color: item.color, 
                        producedMana: item.producedMana
                        }
                    })
                    const authorized = decklist[0].userID === userAttempt 
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