const handleRecommended = (req, res, db) => {
    const { commander, partner } = req.params
    db('cards')
        .select(["cards.card_name", "price", "type", "cmc", "image_url", "modal", "legal", "image_url_2", "entrys.color", "produced_mana", "mana"])
        .count("cards.card_name")
        .join('entrys', 'entrys.card_name', '=', 'cards.card_name')
        .join('decks', 'decks.id', '=', 'cards.deck_id')
        .where(partner !== 'null' ? { commander: commander, partner: partner } : { commander: commander })
        .groupBy(["cards.card_name", "price", "type", "cmc", "image_url", "modal", "legal", "image_url_2", "entrys.color", "produced_mana", "mana"])
        .orderBy('count', 'desc')
        .then(data => {
            if (!data.length) {
                res.json(null)
                return
            }

            const recommendedCreatures = data.filter(item => item.type.includes("Creature")).slice(0, 10);
            const recommendedInstants = data.filter(item => item.type.includes("Instant")).slice(0, 10);
            const recommendedSorceries = data.filter(item => item.type.includes("Sorcery")).slice(0, 10);
            const recommendedEnchantments = data.filter(item => item.type.includes("Enchantment") && !item.type.includes("Creature")).slice(0, 10);
            const recommendedArtifacts = data.filter(item => item.type.includes("Artifact") && !item.type.includes("Creature")).slice(0, 10);
            const recommendedLands = data.filter(item => item.type.includes("Land")).slice(0, 10);
            const recommendedPlaneswalkers = data.filter(item => item.type.includes("Planeswalker")).slice(0, 10);

            const recommendedCards = {
                creatures: formatCards(recommendedCreatures),
                instants: formatCards(recommendedInstants),
                sorceries: formatCards(recommendedSorceries),
                enchantments: formatCards(recommendedEnchantments),
                artifacts: formatCards(recommendedArtifacts),
                lands: formatCards(recommendedLands),
                planeswalker: formatCards(recommendedPlaneswalkers)
            }
            res.json(recommendedCards)
        })
        .catch(err => { res.status(400).json('unable to get recommended') })
}

const formatCards = (data) => {
    const formattedCards = data.map(card => ({
        ...card,
        cardName: card.card_name,
        cardImage: card.image_url,
        cardImage2: card.image_url_2,
        producedMana: card.produced_mana,
    }))
    return formattedCards;
}

module.exports = {
    handleRecommended: handleRecommended
}