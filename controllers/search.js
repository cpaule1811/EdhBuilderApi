const search = (req, res, db) => {
    const { name } = req.query
    const nameFilter = name.toLowerCase().replace(/'|,|-| /g, "")
    db.raw(`SELECT * from entrys where LOWER(REPLACE(REPLACE(REPLACE(REPLACE("cardName", '''',''), ',', ''), '-', ''), ' ', '')) = '${nameFilter}'
    UNION ALL SELECT * FROM entrys WHERE LOWER(REPLACE(REPLACE(REPLACE(REPLACE("cardName", '''',''), ',', ''), '-', ''), ' ', '')) like '%${nameFilter}' 
    or LOWER(REPLACE(REPLACE(REPLACE(REPLACE("cardName", '''',''), ',', ''), '-', ''), ' ', '')) like '${nameFilter}%'
    or LOWER(REPLACE(REPLACE(REPLACE(REPLACE("cardName", '''',''), ',', ''), '-', ''), ' ', '')) like '%${nameFilter}%'
    limit 4;`)
    .then(searchedCards => {
         res.json(searchedCards.rows)
    })
}

module.exports= { 
    search: search
}