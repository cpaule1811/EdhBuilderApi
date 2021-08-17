const updateEntrys = (req, res, db) => {
    db('entrys')
    .insert(req.body)
    .onConflict('cardName')
    .merge()
    .then(resp => { 
        if (resp.length){
            res.json('success')
        }
    })
    .catch(() => res.status(400).json('failure'))
}

module.exports = { 
    updateEntrys: updateEntrys
}