const handleAddRating = (req, res, db) => { 
    const { rating, userID, deckID } = req.body;
    
    db.transaction((trx) => {
        db('ratings').insert({ 
            user_id: userID, 
            deck_id: deckID, 
            rating: rating
        })
        .onConflict(['user_id', 'deck_id'])
        .merge({ rating: rating })
        .returning('deck_id')
        .then(rating => {
            return db('ratings')
            .avg('rating as avg')
            .where('deck_id', '=', rating[0])
            .then(avg => { 
                return db('decks').update({avgRating: Number(avg[0].avg).toFixed(2)}).where('deck_id', '=', rating[0])
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