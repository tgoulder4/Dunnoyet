import { TavilySearchAPIRetriever } from "@langchain/community/retrievers/tavily_search_api";
import OpenAI from "openai";

/**
 * 
 */
type IDocuments = {
    pageContent: string,
    metadata: {
        title: string,
        source: string, //url
    }
}[];
type createProps = {
    model: string,
    messages: { role: "user" | "assistant", content: string }[],
    stream: boolean,
}
//mock prompt chatgpt to form a search query out of thread messsages so far
/**
 * 
 * @param query e.g. Why did the French Revolution happen? I know that the bourbon monarch was overthrown but I don't know why.
 * @param threadSoFar 
 */
export async function createCompletion(query: string, threadSoFar: IThread) {
    const openAI = new MockOpenAI();
    async function main() {
        const messagesToSendToGPT = threadSoFar.messages.map((message) => {
            return { role: message.type == "Response" ? "user" : "assistant", content: "create a search query given the q " + query } as createProps["messages"][0]
        })
        const response = await openAI.chat.completions.create({
            model: "gpt-4",
            messages: messagesToSendToGPT,
            stream: true,
        }); //returns 'french revolution and the bourbon monarch' to search using tavily search api
        const retriever = new MockTavilySearchAPIRetriever({ k: 3 });
        const documents = await retriever.getRelevantDocuments(response);
        const finalResponse = await openAI.chat.completions.create({
            model: "gpt-4",
            messages: messagesToSendToGPT,
            stream: true,
        }); //returns 'french revolution and the bourbon monarch' to search using tavily search api
        return finalResponse;
    }
    const res = await main();
    return res;
    //ask chatgpt to create a search term from builtQuery. use this search term to search in getrelevantdocuments, then use the documents and the builtquery to make a new prompt which will be the result prompt.

}
export class MockOpenAI {
    chat = {
        completions: {
            create: async (props: createProps): Promise<string> => "french revolution and the bourbon monarch"
        }
    }
}

export class MockTavilySearchAPIRetriever {
    k: number;
    constructor({ k }: { k: number }) {
        this.k = k;
    }
    getRelevantDocuments: ((prompt: string) => Promise<IDocuments>) = async () => {
        setTimeout(() => { }, 2000);
        return [
            {
                pageContent: `The Bourbon dynasty governed France from 1589 to 1793 and from 1814 to 1830, creating an absolute monarchy that reached its zenith under Louis XIV and was overthrown during the reign of Louis XVI. `,
                metadata: {
                    title: `French Revolution`,
                    source: `https://revolution.chnm.org/d/1065#:~:text=Text,all%20served%20as%20constitutional%20monarchs.`
                }
            },
            {
                pageContent: `The Bourbon dynasty governed France from 1589 to 1793 and from 1814 to 1830, creating an absolute monarchy that reached its zenith under Louis XIV and was overthrown during the reign of Louis XVI. `,
                metadata: {
                    title: `French Revolution`,
                    source: `https://revolution.chnm.org/d/1065#:~:text=Text,all%20served%20as%20constitutional%20monarchs.`
                }
            },
            {
                pageContent: `The Bourbon dynasty governed France from 1589 to 1793 and from 1814 to 1830, creating an absolute monarchy that reached its zenith under Louis XIV and was overthrown during the reign of Louis XVI. `,
                metadata: {
                    title: `French Revolution`,
                    source: `https://revolution.chnm.org/d/1065#:~:text=Text,all%20served%20as%20constitutional%20monarchs.`
                }
            },

        ]
    }
}