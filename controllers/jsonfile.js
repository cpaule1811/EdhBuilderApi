const handleJsonFile = (req, res, db) => {
    const { file } = req.files
    const jsonString = file.data.toString()
    const jsonData = JSON.parse(jsonString)
    db('entrys').insert(jsonData)
    .returning('cardName')
    .onConflict('cardName')
    .merge(['cardName', 'price'])
    .then(resp => {
        if(res.length) { 
            return res.json('success')
        }
        res.json('failue')
    })
    .catch(err => { res.status(400).json(err)})
}

module.exports = { 
    handleJsonFile: handleJsonFile
}