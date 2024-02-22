//TYPES
export type IMessagesEndpointResponsePayload = {
    newMessages: IMessage[];
    metadata: IMetadata;
}
export type IMessagesEndpointSendPayload = {
    messages: IMessage[];
    metadata: IMetadata;
}
export type IMetadata = {
    lessonID: string;
    threads: IMessage[][];
    subject: string,
    action?: "understood",
    knowledgePointChain: IKnowledge[][];
    currentKnowledgePointChainIndex: number;
}
export type IMessage = {
    content: string | ISplitResponse[];
    eliResponseType?: "General" | "WhatComesToMind" | "ChallengeQ";
    role: "user" | "eli";
    placeHolderText?: string;
};
export type ISplitResponse = { text: string, active: boolean };
export type ILesson = {
    id: string;
    subject: string;
    messages?: IMessage[];
    beganAt: Date;
    lessonStatus: "Active" | "Completed";
    endedAt: Date;
    knowledgePointChain: string[][] | IKnowledge[][];
}
export type IKnowledge = {
    id?: string,
    lessonId: string,
    source: 'reinforced' | 'offered',
    pointInSolitude: string,
    pointInChain: string,
    TwoDCoOrd: number[],
    //5=wellKnown, 4=currentlyTeaching, 3=failedTest,2=target,1=makeNewKnowledgeAnchorPoint
    confidence: number
}
export type IUser = {
    id: string;
    name?: string;
    username: string;
    email: string;
    password: string;
    role?: string;
    lessons: ILesson[] | string[];
    tutorName: string;
    knowledgePointsUnderstood: string[];
};
export type ITip = {
    title: string;
    content: string;
    link: string;
    uiDetailId?: string;

}
export type IDetail = {
    id?: string;
    tips: ITip[];
}