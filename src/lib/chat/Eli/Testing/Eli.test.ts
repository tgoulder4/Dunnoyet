import { howRightIsTheUser, simplifyToKnowledgePoint } from './../instructionsForRetrievingTypeOfTheirMessage';
import { expect, jest, test } from '@jest/globals';
import { IMessage } from '@/lib/validation/enforceTypes';
import { getEmbedding } from '../../openai';
import { saveKnowledgePointsToDBAndPineCone } from '../eli';
const getMessageHistory = (conversationToUse: number, length: number): IMessage[] => {
    const exampleConversation: IMessage[] = [
        {
            content: "What are vectors and scalars?",
            role: "user"
        },
        {
            content: "What comes to mind when you think of vectors?",
            role: "eli",
            eliResponseType: "WhatComesToMind"
        },
        {
            content: "An arrow pointing somewhere",
            role: "user"
        },
        {
            content: "A good start! The length of the arrow pointing somewhere represents the magnitude of the vector. E.g. if it represents velocity, a longer arrow means greater speed.",
            role: "eli",
            eliResponseType: "General"
        },
        {
            content: " If 'down the slope' is considered positive, how is the momentum described when an object moves down the surface?",
            role: "eli",
            eliResponseType: "ChallengeQ"
        },
        {
            content: "The momentum is positive",
            role: "user"
        },


    ];
    const exampleConversation2: IMessage[] = [
        {
            content: "Who were the bourbon kings?",
            role: "user"
        },
        {
            content: "What do you already know about the bourbons?",
            role: "eli",
            eliResponseType: "WhatComesToMind"
        },
        {
            content: "They were the kings of Germany",
            role: "user"
        },
        {
            content: "Not quite, they were the kings of France. What else do you know about them?",
            role: "eli",
            eliResponseType: "General"
        },
        {
            content: "Idk",
            role: "user"
        },
        {
            content: "Try your answer again?",
            role: "eli",
            eliResponseType: "General"
        },
        {
            content: "Actually, The Bourbon kings were a European royal dynasty, most notably ruling France from the late 16th century until the French Revolution. They also held thrones in Spain and other territories.",
            role: "user"
        },
    ];
    switch (conversationToUse) {
        case 1:
            return exampleConversation.slice(0, length);
        case 2:
            return exampleConversation2.slice(0, length);
    }
    return exampleConversation.slice(0, length);
}
describe("Prompt tests", () => {
    it("NON-CRIT:NOTPASSING", () => { })
    test("HowRightIsTheUser", async () => {
        //please test one at once to save on expenses
        let howRight: "FULLY" | "PARTLY" | "NOT" | null = "" as any
        // howRight = await howRightIsTheUser(getMessageHistory(1, 3))
        // expect(howRight).toBe("PARTLY")
        // howRight = await howRightIsTheUser(getMessageHistory(2, 3))
        // expect(howRight).toBe("NOT")
        // howRight = await howRightIsTheUser(getMessageHistory(2, 5))
        // expect(howRight).toBe("NOT")
        // howRight = await howRightIsTheUser(getMessageHistory(2, 7))
        // expect(howRight).toBe("FULLY")
        console.log("howRight: ", howRight)
    })
    it("CRIT:PASSING", () => { })
    test("simplifyToKnowlegePoint", async () => {
        //please test one at once to save on expenses
        // const pointInSolitude = await simplifyToKnowledgePoint(getMessageHistory(1, 3));
        // console.log("pointInSolitude: ", pointInSolitude)
        // expect(pointInSolitude).toBeTruthy()
        // simplifyToKnowledgePoint(getMessageHistory(1, 3)).then((result) => { expect(result).toBeTruthy() })
    })
    it("CRIT: failing so feature challengeq is postponed", () => { })
    test("getIsQuestionResponseTrueOrFalse", async () => {
        //please test one at once to save on expenses
        // let isTrueOrFalse: boolean | null = "" as any
        // isTrueOrFalse = await getIsQuestionResponseTrueOrFalse(getMessageHistory(1, 6))
        // console.log("isTrueOrFalse: ", isTrueOrFalse)
        // expect(isTrueOrFalse).toBe(true)
    })
})

describe("Pinecone and mongodb queries", () => {
    it("IS CRIT:PASSING", () => { });
    test("getEmbedding", async () => {
        //please test one at once to save on expenses
        // const embedding = await getEmbedding("A vector is a quantity that has both magnitude and direction.")
        // expect(embedding).toBeTruthy()
    })
    it("IS CRIT", () => { });
    test("saveKnowledgePoints", async () => {
        //please test one at once to save on expenses
        const rKs = await saveKnowledgePointsToDBAndPineCone("65cbc19a69ec7237e52b4747", [{
            source: "reinforced",
            pointInSolitude: "A vector is a quantity that has both magnitude and direction.",
            pointInChain: "A vector is a quantity that has both magnitude and direction.",
            TwoDCoOrdinates: [0, 0],
            confidence: 5
        }], "65cbc19a69ec7237e52b4747")
        console.log("rKs: ", rKs)
        expect(rKs).toBeTruthy()
    })
})