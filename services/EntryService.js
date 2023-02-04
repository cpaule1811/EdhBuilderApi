const https = require('https');
const fs = require('fs');
const path = require('path');
const prismaClient = require('../prismaClient');
const {
    checkIsDualFacedCard,
    checkCardIsPartner,
    combineColourIdentityArrays,
    combineManaColoursArrays,
    filterIllegalCards
} = require("./EntryFormatService.js");

function checkCardsNeedsUpdate() {
    const path = "./data/cards.json";
    const fileExists = fs.existsSync(path)

    if (!fileExists)
        return true;

    const fileStats = fs.statSync(path)
    const fileAge = fileStats.mtime
    const currentDate = new Date();
    const fileAgeInMilliseconds = (currentDate - fileAge);
    const fileAgeInDays = fileAgeInMilliseconds / (1000 * 3600 * 24);

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

function removeBulkDataFile() {
    const path = "./data/cards.json";
    fs.rmSync(path, { force: true });
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

function getCardsAsJson() {
    const cardsPath = path.resolve(__dirname, '../data/cards.json');
    const cardsAsJson = fs.readFileSync(cardsPath);

    return JSON.parse(cardsAsJson);
}

function convertJsonCardsToEntries(jsonCards) {
    const entries = jsonCards.map(card => {
        const isDualFacedCard = checkIsDualFacedCard(card.layout);
        const colours = isDualFacedCard ? combineManaColoursArrays(card.card_faces) : card.colors;
        const colourIdentity = isDualFacedCard ? combineColourIdentityArrays(card.card_faces) : card.color_identity;
        const imageUrl = isDualFacedCard ? card.card_faces[0].image_uris.normal : card.image_uris.normal;
        const imageUrl2 = isDualFacedCard ? card.card_faces[1].image_uris?.normal : null;
        const cardArt = isDualFacedCard ? card.card_faces[0].image_uris?.art_crop : card.image_uris?.art_crop;
        const type = isDualFacedCard ? card.card_faces.map(face => face.type_line).join(" // ") : card.type_line;
        const manaCost = isDualFacedCard ? card.card_faces.map(face => face.mana_cost).join(" // ") : card.mana_cost;
        const oracleText = isDualFacedCard ? card.card_faces.map(face => face.oracle_text).join(" // ") : card.oracle_text;
        const artist = isDualFacedCard ? card.card_faces[0].artist : card.artist;
        const isLegal = card.legalities.commander === "legal" ? true : false;
        let price = 0;

        if (card.prices.usd) {
            price = parseFloat(card.prices.usd)
        }

        return {
            cardName: card.name,
            type,
            price,
            cmc: card.cmc,
            modal: card.layout,
            imageUrl,
            imageUrl2,
            colour: colours.join(","),
            producedMana: colourIdentity.join(","),
            isLegal,
            manaCost,
            cardArt,
            oracleText,
            isPartner: checkCardIsPartner(card),
            artist,
        }
    });

    return entries;
}

async function uploadCardEntries() {
    const jsonCards = getCardsAsJson();
    const cleanedJsonCards = filterIllegalCards(jsonCards);
    const entries = convertJsonCardsToEntries(cleanedJsonCards);

    try {
        const result = await prismaClient.$transaction(
            entries.map(entry => prismaClient.entry.upsert({
                where: { cardName: entry.cardName },
                update: entry,
                create: entry
            }))
        );
        console.log("Entries uploaded: ", result.length)
    } catch (err) {
        console.log("Error uploading entries: ", err)
    }
}

async function updateEntries() {
    const url = await getDownloadUrl();
    await getBulkDataFile(url);

    try {
        const result = await uploadCardEntries();
        console.log("Enries updated: ", result)
    } catch {
        console.log("Error updating entries")
    }
}

module.exports = {
    getDownloadUrl,
    checkCardsNeedsUpdate,
    getBulkDataFile,
    uploadCardEntries,
    convertJsonCardsToEntries,
    removeBulkDataFile,
    updateEntries
}