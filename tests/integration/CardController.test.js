const request = require('supertest');
const { prismaClient } = require('../../prismaClient');
const { clearTestDB, setupDeck } = require('../cardTestSetup');
const app = require('../../server.js');
const redisClient = require('../../redisClient');

let testDeckId;

beforeAll(async () => {
    await clearTestDB();
    testDeckId = await setupDeck();
})

afterAll(async () => {
    await clearTestDB();
    await prismaClient.$disconnect()
    await redisClient.quit()
})

afterEach(async () => {
    await prismaClient.card.deleteMany()
})

describe("CardController_add", () => {
    test("add_whenGivenBadCardId_shouldReturnNotFoundStatus", async () => {
        const expectedResponseCode = 404;
        const entryId = -1;
        const deckId = testDeckId;
        const quantity = 1;

        const response = await request(app).post("/card/add").send({ entryId, deckId, quantity });

        expect(response.status).toEqual(expectedResponseCode);
    });

    test("add_whenGivenInvalidEntyId_shouldReturnBadRequestStatus", async () => {
        const expectedResponseCode = 400;
        const deckId = testDeckId;
        const entityId = "bad id";
        const quantity = 1;

        const response = await request(app).post("/card/add").send({ deckId, entityId, quantity });

        expect(response.status).toEqual(expectedResponseCode);
    });

    test("add_whenGivenInvalidDeckId_shouldReturnBadRequestStatus", async () => {
        const expectedResponseCode = 400;
        const entryId = 1;
        const deckId = "bad id";
        const quantity = 1;

        const response = await request(app).post("/card/add").send({ entryId, deckId, quantity });

        expect(response.status).toEqual(expectedResponseCode);
    });

    test("add_whenDeckContainsEntryId_shouldUpdateCard", async () => {
        originalQuantity = 1;
        const entryId = 4;
        const expectedResponseCode = 200;
        const quantity = 2;
        const expectedQuantity = originalQuantity + quantity;
        await prismaClient.card.create({
            data: {
                entryId,
                deckId: testDeckId,
                quantity: originalQuantity,
            }
        })

        const response = await request(app).post("/card/add").send({ entryId, deckId: testDeckId, quantity });
        const body = response.body;

        expect(response.status).toEqual(expectedResponseCode);
        expect(body.card.quantity).toEqual(expectedQuantity);
    })

    test("add_whenNoCardInDeck_shouldCreateCard", async () => {
        const expectedResponseCode = 200;
        const entryId = 4;
        const quantity = 1;

        const response = await request(app).post("/card/add").send({ entryId, testDeckId, quantity });
        const body = response.body;

        expect(response.status).toEqual(expectedResponseCode);
        expect(body.card.entryId).toEqual(entryId);
        expect(body.card.quantity).toEqual(quantity);
    })
})