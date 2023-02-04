const CardService = require('../services/CardService');
const CardServiceError = CardService.CardServiceError;

async function add(req, res) {
    const { entryId, quantity, cardStatus, deckId } = req.body;
    const card = {
        entryId,
        quantity,
        cardStatus,
        deckId
    }
    const result = await CardService.add(card);

    if (result.isSuccessful)
        return res.status(200).json({
            card: result.card,
            message: result.message
        })

    if (result.message == CardServiceError.CARD_ALREADY_IN_DECK) {
        updateResult = await CardService.update(card);

        if (updateResult.isSuccessful)
            return res.status(200).json({
                card: updateResult.card,
                message: updateResult.message
            })

        return res.status(400).json({
            message: updateResult.message
        })
    }

    if (result.message == CardServiceError.CARD_NOT_FOUND || result.message == CardServiceError.DECK_NOT_FOUND)
        return res.status(404).json({
            message: result.message
        })

    res.status(400).json({
        message: result.message
    })
}

async function remove(req, res) {

}

module.exports = CardHandler = {
    add
}