const { convertJsonCardsToEntries } = require("./UploadCardEntries");

test("convertJsonCardsToEntries_whenGivenJsonCards_shouldReturnEntries", () => {
    const jsonCards = [{
        name: "Aether Hub",
        layout: "normal",
        border_color: "black",
        mana_cost: "{T}",
        cmc: 1,
        type_line: "Land",
        oracle_text: "({T}: Add {C}.)\r",
        image_uris: {
            normal: "https://img.scryfall.com/cards/normal/front/6/0/60b4b1b1-8b1f-4b1f-8c1f-8f8f8f8f8f8f.jpg?1562871001",
            art_crop: "https://img.scryfall.com/cards/art_crop/front/6/0/60b4b1b1-8b1f-4b1f-8c1f-8f8f8f8f8f8f.jpg?1562871001",
        }, artist: "Daarken",
        legalities: {
            commander: "legal",
        },
        colors: ["W"],
        color_identity: ["W"],
        prices: {
            usd: "0.25",
        },
        keywords: [
            "partner"
        ]
    }];
    const expectedResult = [{
        cardName: "Aether Hub",
        type: "Land",
        modal: "normal",
        manaCost: "{T}",
        cmc: 1,
        oracleText: "({T}: Add {C}.)\r",
        imageUrl: "https://img.scryfall.com/cards/normal/front/6/0/60b4b1b1-8b1f-4b1f-8c1f-8f8f8f8f8f8f.jpg?1562871001",
        imageUrl2: null,
        cardArt: "https://img.scryfall.com/cards/art_crop/front/6/0/60b4b1b1-8b1f-4b1f-8c1f-8f8f8f8f8f8f.jpg?1562871001",
        artist: "Daarken",
        isLegal: true,
        isPartner: false,
        price: 0.25,
        producedMana: "W",
        colour: "W",
    }]

    const result = convertJsonCardsToEntries(jsonCards)

    expect(result).toEqual(expectedResult)
})

test("convertJsonCardsToEntries_whenGivenDualFacedJsonCard_shouldReturnEntries", () => {
    const jsonCards = [{
        name: "Aether Hub",
        layout: "transform",
        border_color: "black",
        cmc: 1,
        legalities: {
            commander: "legal",
        },
        colors: ["W"],
        color_identity: ["W"],
        prices: {
            usd: "0.25",
        },
        keywords: [],
        card_faces: [
            {
                name: "Aether Hub",
                mana_cost: "{T}",
                type_line: "Land",
                oracle_text: "({T}: Add {C}.)\r",
                image_uris: {
                    normal: "https://img.scryfall.com/cards/normal/front/6/0/60b4b1b1-8b1f-4b1f-8c1f-8f8f8f8f8f8f.jpg?1562871001",
                    art_crop: "https://img.scryfall.com/cards/art_crop/front/6/0/60b4b1b1-8b1f-4b1f-8c1f-8f8f8f8f8f8f.jpg?1562871001",
                },
                artist: "Daarken",
                colors: ["W"],
            },
            {
                name: "Aether Hub",
                mana_cost: "{T}",
                type_line: "Land",
                oracle_text: "({T}: Add {C}.)\r",
                image_uris: {
                    normal: "https://img.scryfall.com/cards/normal/front/6/0/60b4b1b1-8b1f-4b1f-8c1f-8f8f8f8f8f8f.jpg?1562871002",
                    art_crop: "https://img.scryfall.com/cards/art_crop/front/6/0/60b4b1b1-8b1f-4b1f-8c1f-8f8f8f8f8f8f.jpg?1562871002",
                },
                artist: "Daarken",
                colors: ["B"],
            }
        ]
    }];
    const expectedResult = [{
        cardName: "Aether Hub",
        manaCost: "{T} // {T}",
        modal: "transform",
        cmc: 1,
        type: "Land // Land",
        price: 0.25,
        isLegal: true,
        isPartner: false,
        oracleText: "({T}: Add {C}.)\r // ({T}: Add {C}.)\r",
        imageUrl: "https://img.scryfall.com/cards/normal/front/6/0/60b4b1b1-8b1f-4b1f-8c1f-8f8f8f8f8f8f.jpg?1562871001",
        imageUrl2: "https://img.scryfall.com/cards/normal/front/6/0/60b4b1b1-8b1f-4b1f-8c1f-8f8f8f8f8f8f.jpg?1562871002",
        cardArt: "https://img.scryfall.com/cards/art_crop/front/6/0/60b4b1b1-8b1f-4b1f-8c1f-8f8f8f8f8f8f.jpg?1562871001",
        artist: "Daarken",
        isLegal: true,
        colour: "W,B",
        producedMana: "",
    }]

    const result = convertJsonCardsToEntries(jsonCards)

    expect(result).toEqual(expectedResult)
})