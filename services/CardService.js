const e = require("express");
const { PrismaError } = require("../prisma/PrismaError");
const prismaClient = require("../prismaClient");

const CardServiceError = {
    CARD_NOT_FOUND: "Could not find specified card.",
    DECK_NOT_FOUND: "Can not add card to non existent deck.",
    CARD_ALREADY_IN_DECK: "Card already in deck.",
    GENERIC_ADD: "Unable to add card to deck",
    GENERIC_UPDATE: "Unable to update card",
    GENERIC_DELETE: "Unable to delete card",
    GENERIC_GET: "Unable to get card",
}

async function add(card) {
    try {
        const result = await prismaClient.card.create({
            data: {
                entryId: card.entryId,
                quantity: card.quantity,
                cardStatus: card.cardStatus,
                deckId: card.deckId,
            }
        })

        return {
            isSuccessful: true,
            message: "Unable to add card to deck",
            card: result
        }
    } catch (e) {
        if (e.code === PrismaError.UNIQUE_CONSTRAINT_VIOLATION)
            return {
                isSuccessful: false,
                message: CardServiceError.CARD_ALREADY_IN_DECK
            }

        if (e.code === PrismaError.FOREIGN_CONSTRAINT_VIOLATION)
            return {
                isSuccessful: false,
                message: e.message.includes("entryId") ? CardServiceError.CARD_NOT_FOUND : CardServiceError.DECK_NOT_FOUND
            }

        return {
            isSuccessful: false,
            message: CardServiceError.GENERIC_ADD
        }
    }
}

async function update(card) {
    try {
        const where = card.id ? { id: card.id } : { entryId_deckId: { entryId: card.entryId, deckId: card.deckId } }
        const result = await prismaClient.card.update({
            where,
            data: {
                quantity: {
                    increment: card.quantity
                },
                cardStatus: card.cardStatus
            }
        })

        return {
            isSuccessful: true,
            card: result
        }
    } catch (e) {
        if (e.code === PrismaError.RECORD_NOT_FOUND)
            return {
                isSuccessful: false,
                message: CardServiceError.CARD_NOT_FOUND
            }

        return {
            isSuccessful: false,
            message: CardServiceError.GENERIC_UPDATE
        }
    }
}

async function drop(cardId) {
    try {
        const result = await prismaClient.card.delete({
            where: {
                id: cardId
            }
        })
        return {
            isSuccessful: true,
            card: result
        }
    } catch (e) {
        if (e.code == PrismaError.RECORD_NOT_FOUND)
            return {
                isSuccessful: false,
                message: CardServiceError.CARD_NOT_FOUND
            }

        return {
            isSuccessful: false,
            message: CardServiceError.GENERIC_DELETE
        }
    }
}

async function get(cardId) {
    try {
        const result = await prismaClient.card.findUnique({
            where: {
                id: cardId
            },
            include: {
                entry: true
            }
        })

        if (result != null)
            return {
                isSuccessful: true,
                card: result
            }

        return {
            isSuccessful: false,
            message: CardServiceError.CARD_NOT_FOUND
        }

    } catch {
        return {
            isSuccessful: false,
            message: CardServiceError.GENERIC_GET
        }
    }
}

const CardService = {
    add,
    update,
    drop,
    get,
    CardServiceError
}

module.exports = CardService;
