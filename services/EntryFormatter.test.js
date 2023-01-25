const { checkIsDualFacedCard, checkCardIsPartner, checkIsLegalCardType, checkIsLegalBorder, combineColoursArrays, combineColourIdentityArrays, combineManaColoursArrays, filterIllegalCards } = require("./EntryFormatter.js");

test("checkIsDualFacedCard_whenCardIsDualFaced_ShouldReturnTrue", () => {
    const layout = "transform";

    const result = checkIsDualFacedCard(layout);

    expect(result).toBe(true)
});

test("checkIsDualFacedCard_whenCardIsNotDualFaced_ShouldReturnFalse", () => {
    const layout = "normal";

    const result = checkIsDualFacedCard(layout);

    expect(result).toBe(false)
});

test("checkCardIsPartner_whenCardHasPartnerKeyword_ShouldReturnTrue", () => {
    const card = {
        keywords: ["Partner"]
    }

    const result = checkCardIsPartner(card);

    expect(result).toBe(true)
});

test("checkCardIsPartner_whenCardHasNoOracleText_ShouldReturnFalse", () => {
    const card = {
        keywords: [],
    }

    const result = checkCardIsPartner(card);

    expect(result).toBe(false)
});

test("checkCardIsPartner_whenCardHasPartnerWithText_ShouldReturnTrue", () => {
    const card = {
        oracle_text: "Partner with ",
        keywords: []
    }

    const result = checkCardIsPartner(card)

    expect(result).toBe(true)
});

test("checkCardIsPartner_whenCardHasNeitherPartnerKeywordOrPartnerWithText_ShouldReturnFalse", () => {
    const card = {
        keywords: [],
        oracle_text: ""
    }

    const result = checkCardIsPartner(card)

    expect(result).toBe(false)
})

test("checkIsLegalCardType_whenCardIsLegalCardType_ShouldReturnTrue", () => {
    const layout = "normal"

    const result = checkIsLegalCardType(layout);

    expect(result).toBe(true)
});

test("checkIsLegalCardType_whenCardIsNotLegalCardType_ShouldReturnFalse", () => {
    const layout = "token"

    const result = checkIsLegalCardType(layout);

    expect(result).toBe(false)
});

test("checkIsLegalBorder_whenCardIsLegalBorder_ShouldReturnTrue", () => {
    const borderColour = "black";

    const result = checkIsLegalBorder(borderColour);

    expect(result).toBe(true)
});

test("checkIsLegalBorder_whenCardIsNotLegalBorder_ShouldReturnFalse", () => {
    const borderColour = "silver";

    const result = checkIsLegalBorder(borderColour);

    expect(result).toBe(false)
});

test("combineColoursArrays_whenGivenDuplicateColours_ShouldReturnCombinedColours", () => {
    const colours = ["W", "U", "R", "U"];
    const expectedResult = ["W", "U", "R"];

    const result = combineColoursArrays(colours);

    expect(result).toEqual(expectedResult)
});

test("combineColourIdentityArrays_whenGivenCardFaceObjects_ShouldReturnCombinedColours", () => {
    const cardFaces = [{ color_identity: ["W", "U", "R"] }, { color_identity: ["W", "U"] }];
    const expectedResult = ["W", "U", "R"];

    const result = combineColourIdentityArrays(cardFaces);

    expect(result).toEqual(expectedResult)
});

test("combineManaColourArrays_whenGivenCardFaceObjects_ShouldReturnCombinedColours", () => {
    const cardFaces = [{ colors: ["W", "U", "R"] }, { colors: ["W", "U"] }];
    const expectedResult = ["W", "U", "R"];

    const result = combineManaColoursArrays(cardFaces);

    expect(result).toEqual(expectedResult)
});

test("filterIllegalCards_whenCardIsNotLegal_ShouldReturnLegalCards", () => {
    const card = {
        layout: "normal",
        border_color: "black"
    }
    const token = {
        layout: "token",
        border_color: "black"
    }
    const badCard = {
        layout: "token",
        border_color: "silver"
    }
    const jokeCard = {
        border_color: "silver",
        layout: "normal"
    }

    const result = filterIllegalCards([card, token, badCard, jokeCard]);

    expect(result.length).toEqual(1)
});