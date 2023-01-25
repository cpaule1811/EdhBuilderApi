const https = require('https');
const fs = require('fs');
const path = require('path');
const { prismaClient } = require('../prismaClient');

function checkCardsNeedsUpdate() {
    const path = "./data/cards.json";
    const fileExists = fs.existsSync(path)

    if (!fileExists)
        return true;

    const fileStats = fs.statSync
    const fileAge = fileStats.mtime
    const currentDate = new Date();
    const fileAgeInDays = (currentDate - fileAge) / (1000 * 3600 * 24);

    if (fileAgeInDays > 1) {
        return true;
    }

    return false;
}

async function getDownloadUrl() {
    const bulkDataUrl = "https://api.scryfall.com/bulk-data/oracle-cards";

    return new Promise((resolve) => {
        https.get(bulkDataUrl, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                const parsedData = JSON.parse(data);
                resolve(parsedData.download_uri);
            });
        })
    });
}

async function getBulkDataFile(fileDownloadUri) {
    return new Promise((resolve) => {
        https.get(fileDownloadUri, (res) => {
            const path = "./data/cards.json";
            const writeStream = fs.createWriteStream(path);

            res.pipe(writeStream).on('error', function (e) {
                console.log(e)
            });;

            writeStream.on("finish", () => {
                writeStream.close();
                resolve()
            });
        });
    });
}

function checkCardIsPartner(card) {
    if (card.keywords.includes("Partner"))
        return true;

    if (card.oracle_text)
        if (card.oracle_text.includes("Partner with "))
            return true;

    return false;
}

function checkIsLegalCardType(layout) {
    const layoutsToFilter = ["art_series", "double_faced_token", "token", "vanguard", "emblem", "adventrue", "scheme", "planar"]

    return !layoutsToFilter.includes(layout);
}

function checkIsLegalBorder(border) {
    return border !== "silver";
}

function cleanJsonCards(jsonCards) {
    return jsonCards.filter(card =>
        checkIsLegalCardType(card.layout) &&
        checkIsLegalBorder(card.border_color));
}

const dualFacedLayouts = [
    "transform",
    "modal_dfc",
    "flip"
]

function checkIsDualFacedCard(layout) {
    return dualFacedLayouts.includes(layout);
}

function combineColoursArrays(colours) {
    return [...new Set(colours)];
}

function combineManaColoursArrays(cardFaces) {
    let colours = [];
    cardFaces.forEach(face => {
        colours = colours.concat(face.colors);
    })
    return combineColoursArrays(colours)
}

function combineColourIdentityArrays(cardFaces) {
    let colourIdentity = [];
    cardFaces.forEach(face => {
        colourIdentity = colourIdentity.concat(face.color_identity);
    })
    return combineColoursArrays(colourIdentity)
}

function getCardsAsJson() {
    const cardsPath = path.resolve(__dirname, '../data/cards.json');
    const cardsAsJson = fs.readFileSync(cardsPath);

    return JSON.parse(cardsAsJson);
}

function convertJsonCardsToEntries(jsonCards) {
    const cleanedJsonCards = cleanJsonCards(jsonCards);

    const entries = cleanedJsonCards.map(card => {
        const isDualFacedCard = checkIsDualFacedCard(card.layout);
        const colours = isDualFacedCard ? combineManaColoursArrays(card.card_faces) : card.colors;
        const colourIdentity = isDualFacedCard ? combineColourIdentityArrays(card.card_faces) : card.color_identity;
        const imageUrl = isDualFacedCard ? card.card_faces[0].image_uris?.normal ?? "nothing" : card.image_uris?.normal ?? "nothing";
        const imageUrl2 = isDualFacedCard ? card.card_faces[1].image_uris?.normal ?? "nothing" : null;
        const cardArt = isDualFacedCard ? card.card_faces[0].image_uris?.art_crop ?? "nothing" : card.image_uris?.art_crop ?? "nothing";
        let price = 0;

        if (card.prices.usd) {
            price = parseFloat(card.prices.usd)
        }

        return {
            cardName: card.name,
            type: card.type_line ?? card.card_faces[0].type_line + " // " + card.card_faces[1].type_line,
            price,
            cmc: card.cmc,
            modal: card.layout,
            imageUrl: imageUrl,
            imageUrl2: imageUrl2,
            color: colours.join(","),
            producedMana: colourIdentity.join(","),
            legal: card.legalities.commander,
            mana: card.mana_cost ?? card.card_faces[0].mana_cost + " // " + card.card_faces[1].mana_cost,
            cardArt: cardArt,
            oracleText: card.oracle_text ?? card.card_faces[0].oracle_text + " // " + card.card_faces[1].oracle_text,
            isPartner: checkCardIsPartner(card),
            artist: card.artist ?? card.card_faces[0].artist
        }
    });

    return entries;
}

async function uploadCardEntries(db) {
    const jsonCards = getCardsAsJson();
    const entries = convertJsonCardsToEntries(jsonCards);

    try {
        const result = await prismaClient.$transaction(
            entries.map(entry => prismaClient.entry.upsert({
                where: { cardName: entry.cardName },
                update: entry,
                create: entry
            }))
        );

        console.log("update result: ", result);
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getDownloadUrl,
    checkCardsNeedsUpdate,
    getBulkDataFile,
    uploadCardEntries,
    checkCardIsPartner,
    checkIsLegalCardType,
    checkIsLegalBorder,
    cleanJsonCards,
    checkIsDualFacedCard,
    combineColoursArrays,
    combineManaColoursArrays,
    combineColourIdentityArrays,
    filterDuplicateCardNames
}