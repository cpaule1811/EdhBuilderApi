const handleJsonFile = (req, res, db) => {
    const { file } = req.files
    const jsonString = file.data.toString()
    const jsonData = JSON.parse(jsonString).splice(20000, 2000)
         db.raw(
            `UPDATE entrys
            SET price = (case ${cardCases(jsonData)}
                            end)
            WHERE LOWER(REPLACE(REPLACE(REPLACE(REPLACE("cardName", '''',''), ',', ''), '-', '') in (${whereCards(jsonData)});`)
        .then(resp => {
            console.log(resp)
           res.json("this worked")
        })
        .catch(err => { console.log(err); res.status(400).json('could not update') })
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