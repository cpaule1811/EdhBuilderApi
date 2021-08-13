const handleRecommended = (req, res, db) => { 
    const { commander, partner } = req.params 
    db('cards')
    .select(["cards.cardName", "price", "type", "cmc", "imageUrl", "modal", "legal", "imageUrl2", "entrys.color", "producedMana", "mana"])
    .count("cards.cardName")
    .join('entrys', 'entrys.cardName', '=', 'cards.cardName' )
    .join('decks', 'decks.deckID', '=', 'cards.deckID')
    .where(partner !== 'null' ? {commander: commander, partner: partner} : {commander: commander})
    .groupBy(["cards.cardName", "price", "type", "cmc", "imageUrl", "modal", "legal", "imageUrl2", "entrys.color", "producedMana", "mana"])
    .orderBy('count', 'desc')
    .then(data => {
        if (!data.length) { 
            res.json(null)
            return
        }
        const recommendedCard = { 
            creatures: data.filter(item => item.type.includes("Creature")).slice(0,10),
            instants: data.filter(item => item.type.includes("Instant")).slice(0,10),
            sorceries: data.filter(item => item.type.includes("Sorcery")).slice(0,10),
            enchantments: data.filter(item => item.type.includes("Enchantment") && !item.type.includes("Creature")).slice(0,10),
            artifacts: data.filter(item => item.type.includes("Artifact") && !item.type.includes("Creature")).slice(0,10),
            lands: data.filter(item => item.type.includes("Land")).slice(0,10),
            planeswalker: data.filter(item => item.type.includes("Planeswalker")).slice(0,10),
        }
        res.json(recommendedCard)
    })
    .catch(err => { res.status(400).json('unable to get recommended'); console.log(err) })
}

module.exports = { 
    handleRecommended: handleRecommended
}