//TYPES
export type IMessagesEndpointResponsePayload = {
    newMessages: IMessage[];
    metadata: IMetadata;
}
export type IMessagesEndpointSendPayload = {
    messages: IMessage[];
    metadata: IMetadata;
}
export type ILessonState = {
    oldMessages: IMessage[];
    newMessages: IMessage[];
    metadata: IMetadata;
}
export type IMetadata = {
    metadataId?: string;
    lessonID: string;
    threads: IMessage[][];
    subjects: string[];
    action?: "UNDERSTOOD" | 'ENDLESSON',
    knowledgePointChain: Array<IKnowledge>;
    currentKnowledgePointIndex: number;
    errorWithTheirInput?: string;
}
export type INode = {
    knowledgePointID: string,
    confidence: number,
    pointInSolitude: string,
    pointInChain: string,
    TwoDCoOrdinates: number[],
}
export type IMessage = {
    id?: string;
    content?: string;
    splitResponse?: ISplitResponse;
    eliResponseType?: "General" | "WhatComesToMind" | "ChallengeQ" | 'System';
    role: "user" | "eli";
    placeHolderText?: string;
};
export type ISplitResponse = { text: string, active: boolean };
export type ILesson = {
    id: string;
    userID?: string;
    messages?: IMessage[];
    beganAt: Date;
    endedAt: Date | null;
    lessonState: ILessonState;
}
/**
 * @confidence 5=wellKnown, 4=currentlyTeaching, 3=failedTest,2=target,1=makeNewKnowledgeAnchorPoint
 */
export type IKnowledge = {
    id?: string,
    lessonId?: string,
    userId?: string,
    source: 'reinforced' | 'offered',
    pointInSolitude: string,
    pointInChain: string,
    TwoDCoOrdinates: number[],
    vectorEmbedding: number[],
    //5=wellKnown, 4=currentlyTeaching, 3=failedTest,2=target,1=makeNewKnowledgeAnchorPoint
    confidence: number

}
export type IUser = {
    id: string;
    name: string;
    username: string;
    email: string;
    password?: string;
    role?: string;
    lessons: ILesson[];
    knowledgePoints?: IKnowledge[];
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