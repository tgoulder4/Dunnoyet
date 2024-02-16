
//TYPES
export type IMessage = {
    content: string;
    role: "User" | "Assistant";
    type: "New_Question" | "Question" | "Response" | "Interrogation";
    placeHolderText?: string;
};
export type ILesson = {
    id: string;
    subject: string;
    messages?: IMessage[];
    beganAt: Date;
    updatedAt: Date;
    currentKnowledgeSummary: string
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