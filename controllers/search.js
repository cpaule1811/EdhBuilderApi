const search = (req, res, db) => {
    const { name } = req.query
    const nameFilter = name.toLowerCase().replace(/'|,|-| /g, "")
    db.raw(`SELECT * FROM entrys WHERE LOWER(REPLACE(REPLACE(REPLACE(REPLACE("card_name", '''',''), ',', ''), '-', ''), ' ', '')) like '%${nameFilter}' 
    or LOWER(REPLACE(REPLACE(REPLACE(REPLACE("card_name", '''',''), ',', ''), '-', ''), ' ', '')) like '${nameFilter}%'
    or LOWER(REPLACE(REPLACE(REPLACE(REPLACE("card_name", '''',''), ',', ''), '-', ''), ' ', '')) like '%${nameFilter}%'
    ORDER BY LENGTH("card_name") limit 4;`)
        .then(searchedCards => {
            res.json(searchedCards.rows)
        })
}

module.exports = {
    search: search
}