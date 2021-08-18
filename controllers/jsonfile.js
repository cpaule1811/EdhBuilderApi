const handleJsonFile = (req, res, db) => {
    const { file } = req.files
    const jsonString = file.data.toString()
    const jsonData = JSON.parse(jsonString)
         db.raw(
            `UPDATE entrys
            SET price = (case ${cardCases(jsonData)}
                            end)
            WHERE "cardName" in (${whereCards(jsonData)});`)
        .then(resp => {
            console.log(resp)
           res.json("this worked")
        })
        .catch(err => { console.log(err); res.status(400).json('could not update') })
    res.json('success')
}

const cardCases = (jsonData) => {
    let cases = ""
    jsonData.forEach(item => {
        cases += `WHEN "cardName" = '${item.cardName}' THEN ${item.price}} `
    })
    return cases
}

const whereCards = (jsonData) => { 
    return jsonData.map(item => { 
        return `'${item.cardName}'`
    }).join()
}

module.exports = { 
    handleJsonFile: handleJsonFile
}