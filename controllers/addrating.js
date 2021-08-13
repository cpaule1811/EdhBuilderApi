const handleAddRating = (req, res, db) => { 
    const { rating, userID, deckID } = req.body;
    
    db.transaction((trx) => {
        db('ratings').insert({ 
            userID: userID, 
            deckID: deckID, 
            rating: rating
        })
        .onConflict(['userID', 'deckID'])
        .merge({ rating: rating })
        .returning('deckID')
        .then(rating => {
            return db('ratings')
            .avg('rating as avg')
            .where('deckID', '=', rating[0])
            .then(avg => { 
                return db('decks').update({avgRating: Number(avg[0].avg).toFixed(2)}).where('deckID', '=', rating[0])
            })
          })
          .then(trx.commit)
          .catch(trx.rollback);
      })
      .then(resp => res.json(resp))
      .catch(err => res.status(400).json(err) )
}

module.exports = { 
    handleAddRating: handleAddRating
}