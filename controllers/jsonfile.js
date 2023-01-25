const handleJsonFile = (req, res, db) => {
    const { file } = req.files
    const jsonString = file.data.toString()
    const jsonData = JSON.parse(jsonString)
    db('entrys').insert(jsonData)
        .returning('card_name')
        .onConflict('card_name')
        .merge(['card_name', 'price'])
        .then(resp => {
            if (res.length) {
                return res.json('success')
            }
            res.json('failue')
        })
        .catch(err => { res.status(400).json(err) })
}

module.exports = {
    handleJsonFile: handleJsonFile
}