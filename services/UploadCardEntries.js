const https = require('https');
const fs = require('fs');

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

function getBulkDataFile(fileDownloadUri) {
    https.get(fileDownloadUri, (res) => {
        const path = "./data/cards.json";
        const writeStream = fs.createWriteStream(path);

        res.pipe(writeStream).on('error', function (e) {
            console.log(e)
        });;

        writeStream.on("finish", () => {
            writeStream.close();
            console.log("Download Completed");
        });
    });
}

function checkCardIsPartner(card) {
    if (card.keywords.includes("Partner"))
        return true;

    if (card.oracle_text.includes("Partner with "))
        return true;

    return false;
}

function convertJsonCardToEntry() {
    const path = "./data/cards.json";
    const fileExists = fs.existsSync(path)

    if (!fileExists)
        return;

    const cardsAsJson = fs.readFileSync(path);
    const parsedJsonCards = JSON.parse(cardsAsJson);

    const entries = parsedJsonCards.map(card => ({
        card_name: card.name,
        type: card.type_line,
        price: card.prices.usd,
        cmc: card.cmc,
        modal: card.layout,
        image_url: card.image_uris.normal,
        image_url2: card.image_uris.art_crop,
        color: card.colors,
        produced_mana: card.color_identity,
        legal: card.legalities.commander,
        mana: card.mana_cost,
        card_art: card.artist,
        oracle_text: card.oracle_text,
        is_partner: checkCardIsPartner(card),
        artist: card.artist
    }));

    return entries;
}

function uploadCardEntries(db) {
    const entries = convertJsonCardToEntry();
    console.log(db('entrys')
        .insert(entries)
        .toString())

    return db.raw(
        db('entrys')
            .insert(entries)
            .toString() + " " +
        'ON CONFLICT (card_name) DO UPDATE SET type = excluded.type, price = excluded.price, cmc = excluded.cmc, modal = excluded.modal, image_url = excluded.image_url, image_url2 = excluded.image_url2, color = excluded.color, produced_mana = excluded.produced_mana, legal = excluded.legal, mana = excluded.mana, card_art = excluded.card_art, oracle_text = excluded.oracle_text, is_partner = excluded.is_partner, artist = excluded.artist'
    );
}

module.exports = {
    getDownloadUrl,
    checkCardsNeedsUpdate,
    getBulkDataFile,
    uploadCardEntries
}