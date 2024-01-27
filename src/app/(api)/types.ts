//TYPES
export type IFile = {
    id: string;
    sourceID: string;
    name: string;
    uploadedAt: string;
    type: string;
};
export type ISource = {
    id: string;
    userID: string;
    subject: string;
    lastUsed: string;
    files: string[];
};
export type IMessage = {
    content: string;
    type: "New_Question" | "Question" | "Response" | "Interrogation";
    placeHolderText?: string;
};
export type IThread = {
    id: string;
    messages: IMessage[];
    sourceID: string[];
    lastUsed: string;
    subject: string;
};
export type IUser = {
    id: string;
    name: string;
    email: string;
    password: string;
    threads: { threadQuestion: string, threadID: string }[];
};