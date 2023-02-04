const prismaClient = require('../../prismaClient');
const CardService = require('../../services/CardService.js');
const CardServiceError = CardService.CardServiceError;

let testDeckId;

beforeAll(async () => {
    const testUser = await prismaClient.user.create({
        data: {
            username: "Test User",
            email: "test@gmail.com",
            hash: "password",
            profile: "image",
            joined: new Date(),
        }
    })

    const testDeck = await prismaClient.deck.create({
        data: {
            name: "Test Deck",
            description: "Test Deck Description",
            commanderId: 24,
            userId: testUser.id,
            created: new Date(),
        }
    })

    testDeckId = testDeck.id;
})

afterAll(async () => {
    await prismaClient.$transaction([
        prismaClient.card.deleteMany(),
        prismaClient.deck.deleteMany(),
        prismaClient.user.deleteMany(),
    ])

    await prismaClient.$disconnect()
})

afterEach(async () => {
    await prismaClient.card.deleteMany()
})

describe("CardService_add", () => {
    test("add_whenGivenBadEntry_shouldReturnError", async () => {
        const card = {
            entryId: -1,
            quantity: 1,
            cardStatus: "mainboard",
            deckId: testDeckId,
        }
        const expectedResult = {
            isSuccessful: false,
            message: CardServiceError.CARD_NOT_FOUND
        }

        const result = await CardService.add(card);

        expect(result).toEqual(expectedResult)
    });

    test("add_whenGivenBadDeck_shouldReturnError", async () => {
        const card = {
            entryId: 4,
            quantity: 1,
            cardStatus: "mainboard",
            deckId: -1,
        }
        const expectedResult = {
            isSuccessful: false,
            message: CardServiceError.DECK_NOT_FOUND
        }

        const result = await CardService.add(card);

        expect(result).toEqual(expectedResult)
    });

    test("add_whenCardAlreadyInDeck_shouldReturnMessage", async () => {
        const card = {
            entryId: 4,
            quantity: 1,
            cardStatus: "mainboard",
            deckId: testDeckId,
        }
        const expectedResult = {
            isSuccessful: false,
            message: CardServiceError.CARD_ALREADY_IN_DECK
        }

        await CardService.add(card);
        const result = await CardService.add(card);

        expect(result).toEqual(expectedResult)
    })

    test("add_whenGivenInvalidData_shouldReturnGenericMessage", async () => {
        const card = {
            entryId: 4,
            quantity: [],
            cardStatus: "mainboard",
            deckId: testDeckId,
        }
        const expectedResult = {
            isSuccessful: false,
            message: CardServiceError.GENERIC_ADD
        }

        const result = await CardService.add(card);

        expect(result).toEqual(expectedResult)
    })

    test("add_whenGivenValidCard_shouldReturnAddedCard", async () => {
        const card = {
            entryId: 4,
            quantity: 1,
            cardStatus: "mainboard",
            deckId: testDeckId,
        }
        const expectedResult = {
            cardName: "Storm Crow",
            quantity: 1,
        }

        const result = await CardService.add(card)

        expect(result.isSuccessful).toEqual(true)
        expect(result.card).toHaveProperty("id")
        expect(result.card).toHaveProperty("quantity", expectedResult.quantity)
    })
})

describe("CardService_update", () => {
    test("update_whenGivenInvalidData_shouldReturnGenericMessage", async () => {
        const card = {
            entityId: 1,
            deckId: testDeckId,
            quantity: [],
            cardStatus: 5,
        }
        const expectedResult = {
            isSuccessful: false,
            message: CardServiceError.GENERIC_UPDATE
        }

        const result = await CardService.update(card)

        expect(result).toEqual(expectedResult)
    })

    test("update_whenGivenNonExistentCard_shouldReturnCardNotFound", async () => {
        const card = {
            entryId: -1,
            quantity: 1,
            cardStatus: "mainboard",
            deckId: -1,
        }
        const expectedResult = {
            isSuccessful: false,
            message: CardServiceError.CARD_NOT_FOUND
        }

        const result = await CardService.update(card)

        expect(result).toEqual(expectedResult)
    })

    test("update_whenGivenValidData_shouldReturnUpdatedCard", async () => {
        const card = {
            entryId: 4,
            quantity: 1,
            cardStatus: "mainboard",
            deckId: testDeckId,
        }
        const expectedResult = {
            cardName: "Storm Crow",
            quantity: 2,
        }

        await CardService.add(card);
        const result = await CardService.update(card)

        expect(result.isSuccessful).toEqual(true)
        expect(result.card.quantity).toEqual(expectedResult.quantity)
    })
})

describe("CardService_drop", () => {
    test("drop_whenGivenNonExistingCard_shouldReturnError", async () => {
        const cardId = -1;
        const expectedResult = {
            isSuccessful: false,
            message: CardServiceError.CARD_NOT_FOUND
        }

        const result = await CardService.drop(cardId)

        expect(result).toEqual(expectedResult)
    })

    test("drop_whenGivenValidData_shouldReturnSuccess", async () => {
        const insertedCard = await prismaClient.card.create({
            data: {
                entryId: 4,
                quantity: 1,
                cardStatus: "mainboard",
                deckId: testDeckId,
            }
        })
        const cardId = insertedCard.id;
        const expectedResult = {
            isSuccessful: true,
            card: {
                ...insertedCard,
                id: cardId,
            }
        }

        const result = await CardService.drop(cardId)

        expect(result).toEqual(expectedResult)
    })
})

describe("CardService_get", () => {
    test("get_whenGivenNonExistingCard_shouldReturnError", async () => {
        const cardId = -1;
        const expectedResult = {
            isSuccessful: false,
            message: CardServiceError.CARD_NOT_FOUND
        }

        const result = await CardService.get(cardId)

        expect(result).toEqual(expectedResult)
    })

    test("get_whenGivenValidData_shouldReturnCard", async () => {
        const insertedCard = await prismaClient.card.create({
            data: {
                entryId: 4,
                quantity: 1,
                cardStatus: "mainboard",
                deckId: testDeckId,
            }
        })
        const cardId = insertedCard.id;

        const result = await CardService.get(cardId)

        expect(result.isSuccessful).toBeTruthy()
        expect(result.card).toHaveProperty("id", cardId)
        expect(result.card).toHaveProperty("quantity", insertedCard.quantity)
        expect(result.card.entry).toHaveProperty("cardName", "Storm Crow")
    })
})