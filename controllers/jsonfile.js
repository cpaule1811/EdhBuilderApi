const handleJsonFile = (req, res, db) => {
    const { file } = req.files
    const jsonString = file.data.toString()
    const jsonData = JSON.parse(jsonString)
    db('entrys').insert(jsonData)
    .returning('cardName')
    .onConflict('cardName')
    .merge(['cardName', 'price'])
    .then(resp => {
        console.log(resp)
        res.json(resp)
    })
    .catch(err => { console.log(err); res.status(400).json(err)})
        //  db.raw(
        //     `UPDATE entrys
        //     SET price = (case ${cardCases(jsonData)}
        //                     end)
        //     WHERE REPLACE(REPLACE(REPLACE(REPLACE("cardName", '''',''), ',', ''), '-', ''), ' ', '') in (${whereCards(jsonData)});`)
        // .then(resp => {
        //     console.log(resp)
        //    res.json("this worked")
        // })
        // .catch(err => { console.log(err); res.status(400).json('could not update') })
}

const cardCases = (jsonData) => {
    let cases = ""
    jsonData.forEach(item => {
        cases += `WHEN "cardName" = '${item.cardName.replace(/'|,|-| /g, "")}' THEN ${item.price} `
    })
    return cases
}

const whereCards = (jsonData) => { 
    return jsonData.map(item => { 
        return `'${item.cardName.replace(/'|,|-| /g, "")}'`
    }).join()
}

module.exports = { 
    handleJsonFile: handleJsonFile
}