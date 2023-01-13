const getCommanders = (req, res, db) => {

    db.raw(`select * from entrys 
    where "type" like 'Legendary Creature%' or "type" 
    like 'Legendary Enchantment Creature%' or oracle_text like '%can be your commander%'
    order by "type";`)
        .then(commanders => {
            const formattedCommanders = commanders.rows.map(commander => ({
                cardName: commander.card_name,
                oracle_text: commander.oracle_text,
                isPartner: commander.is_partner
            }))

            res.send(formattedCommanders);
        })
        .catch(error => res.status(400).json("could not get commanders"))
}

module.exports = {
    getCommanders: getCommanders
}