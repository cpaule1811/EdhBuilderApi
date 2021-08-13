const handleExceldecklist = (req, res, db) => { 
    const { data, deckID } = req.body
    let cleanData = [];
    data.forEach(item => {
        cleanData.push(...item.filter(item => item !== null && typeof item === "string"))
    });
    cleanData = [...new Set(cleanData.map(item => `'${item.toLowerCase().replace(/'|,|-| /g, "")}'`))].join()

    db.raw(`SELECT "cardName" FROM entrys WHERE LOWER(REPLACE(REPLACE(REPLACE(REPLACE("cardName", '''',''), ',', ''), '-', ''), ' ', '')) in (${cleanData});`)
    .then(resp => {
        const cardsToAdd = resp.rows.map(item => { 
            return { 
                cardName: item.cardName, 
                deckID: deckID, 
                quantity: 1, 
                cardStatus: "main"
            }})
            db('cards').insert(cardsToAdd)
            .returning('*')
            .onConflict(['cardName', 'deckID'])
            .merge()
            .then((cards) => { res.json(cards) })
            .catch((error) => { console.log(error)});
        })
}

module.exports = { 
    handleExceldecklist: handleExceldecklist
}