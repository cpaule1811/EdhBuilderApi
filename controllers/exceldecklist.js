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
                deck_id: deckID, 
                quantity: 1, 
                cardStatus: "main"
            }})
            db('cards').insert(cardsToAdd)
            .returning('*')
            .onConflict(['cardName', 'deck_id'])
            .merge()
            .then(() => { res.json("success") })
            .catch(() => { res.status(400).json('could not add cards from excel') });
        })
}

module.exports = { 
    handleExceldecklist: handleExceldecklist
}