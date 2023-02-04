const { prismaClient } = require('../prismaClient');

async function clearTestDB() {
    await prismaClient.$transaction([
        prismaClient.deck.deleteMany(),
        prismaClient.user.deleteMany(),
    ])
}

async function setupDeck() {
    const user = await prismaClient.user.create({
        data: {
            username: "Test User",
            email: "test@gmail.com",
            hash: "password",
            profile: "image",
            joined: new Date(),
        }
    })

    const deck = await prismaClient.deck.create({
        data: {
            name: "Test Deck",
            description: "Test Deck Description",
            commanderId: 24,
            userId: user.id,
            created: new Date(),
        }
    })

    return deck.id;
}

module.exports = {
    clearTestDB,
    setupDeck
}