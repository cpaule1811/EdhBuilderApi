function filterIllegalCards(jsonCards) {
    return jsonCards.filter(card =>
        checkIsLegalCardType(card.layout) &&
        checkIsLegalBorder(card.border_color));
}

const dualFacedLayouts = [
    "transform",
    "modal_dfc",
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
    });

    return combineColoursArrays(colours);
}

function combineColourIdentityArrays(cardFaces) {
    let colourIdentity = [];
    cardFaces.forEach(face => {
        colourIdentity = colourIdentity.concat(face.color_identity);
    });

    return combineColoursArrays(colourIdentity);
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

module.exports = {
    filterIllegalCards,
    checkIsDualFacedCard,
    combineColoursArrays,
    combineManaColoursArrays,
    combineColourIdentityArrays,
    checkCardIsPartner,
    checkIsLegalCardType,
    checkIsLegalBorder
};