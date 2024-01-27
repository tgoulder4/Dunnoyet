import { IFile, IMessage, ISource, IThread, IUser } from "../types";
import { users, threads } from "../mockData";
import { MockTavilySearchAPIRetriever, createCompletion } from "./createCompletion";
import sleep from "../../../../lib/sleep";

//DATA
export async function getUsersThreadsWhereUserIdIs(userId: string): Promise<IThread[]> {
    await sleep(2000);

    //find user by id then reutrn their threads
    const result: IUser | undefined = users.find((user) => user.id === userId);
    if (result) {
        const threads: IThread[] = [];
        result.threads.forEach((threadID) => {
            const thread = getThreadFromDatabaseWhereThreadIdIs(threadID);
            if (thread) {
                threads.push(thread);
            }
        });
        return threads;
    } else {
        throw new Error("User not found");
    }
}

export async function addMessagesToThreadWhereThreadIdIs(question: string, response: string, threadId: number): Promise<void> {
    const result: IThread | undefined = threads.find(
        (thread) => thread.id === threadId.toString()
    );
    if (result) {
        result.messages.push({ content: question, type: "Question" })
        result.messages.push({ content: response, type: "Response" })
        await sleep(1000);
    } else {
        throw new Error("Thread not found")
    }
}

export async function getMessagesFromDatabaseWhereThreadIdIs(threadID: string): Promise<IMessage[] | null> {
    await sleep(2000);
    const result: IThread | undefined = threads.find(
        (thread) => thread.id === threadID
    );
    if (result) {
        return result.messages;
    } else {
        return null;
    }
}

export async function createCompletionMessage(thread: IThread, builtQuery: string): Promise<string> {
    const response = await createCompletion(builtQuery, thread)
    return response;
}

export async function getFilesByFileIDs(fileIDs: string[]): Promise<IFile[]> {
    const result: IFile[] = [];
    fileIDs.forEach((fileID) => {
        const file = files.find((file) => file.id === fileID);
        if (file) {
            result.push(file);
        }
    });
    return result;
}

//MANIPULATION
export async function getUserByID(id: string): Promise<IUser | null> {
    await sleep(2000);
    const result: IUser | undefined = users.find((user) => user.id === id);
    if (result) {
        return result;
    } else {
        return null;
    }
}
export async function getUserThreadByQuestion(userID: string, threadSubject: string): Promise<IThread | null> {
    await sleep(2000);
    const user: IUser | null = await getUserByID(userID);
    const result = user?.threads.find(
        (thread) => thread.threadQuestion === threadSubject
    );
    if (result) {
        const t = await getThreadByID(result.threadID);
        return t;
    } else {
        return null;
    }
}
export async function getThreadByID(threadID: string) {
    await sleep(2000);
    const result: IThread | undefined = threads.find((thread) => thread.id === threadID);
    if (result) {
        return result;
    } else {
        return null;
    }
}
export async function addFileToDatabase(_file: IFile): Promise<void> {
    await sleep(2000);
    files.push(_file);
}

export async function getFileFromDatabaseWhereIdIs(id: string): Promise<IFile | null> {
    await sleep(2000);
    const result: IFile | undefined = files.find((file) => file.id === id);
    if (result) {
        return result;
    } else {
        return null;
    }
}

export async function getThreadsByUserId(id: string): Promise<IThread[]> {
    await sleep(2000);
    const result: IThread[] = threads.filter((thread) =>
        thread.sourceID.includes(id)
    );
    return result;
}
