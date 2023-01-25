const updateEntrys = (req, res, db) => {
    const { cardsToAdd } = req.body
    db('entrys')
        .insert(cardsToAdd)
        .returning('*')
        .onConflict('card_Nme')
        .merge()
        .then(resp => {
            if (resp.length) {
                res.json('success')
            }
            res.status(400).json('failure')
        })
        .catch((err) => { res.status(400).json('failure') })
}

module.exports = {
    updateEntrys: updateEntrys
}