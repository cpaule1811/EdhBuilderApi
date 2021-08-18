const updateEntrys = (req, res, db) => {
    const { cardsToAdd } = req.body
    db('entrys')
    .insert(cardsToAdd)
    .returning('*')
    .onConflict('cardName')
    .merge()
    .then(resp => { 
        if (resp.length){
            res.json('success')
        }
    })
    .catch((err) => { console.log(err); res.status(400).json('failure') })
}

module.exports = { 
    updateEntrys: updateEntrys
}