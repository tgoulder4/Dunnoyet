//TYPES
export type IMessage = {
    content: string;
    role: "User" | "Assistant";
    type: "New_Question" | "Question" | "Response" | "Interrogation";
    placeHolderText?: string;
};
export type ILesson = {
    id: string,
    subject: string;
    messages: IMessage[];
    beganAt: string;
    updatedAt: string;
}
export type IUser = {
    id: string;
    name: string;
    username: string;
    email: string;
    password: string;
    lessons: ILesson[];
    tutorName: string;
    knowledgePointsUnderstood: string[];
};
export type ITip = {

    id?: string;
    title: string;
    content: string;
    link: string;
    uiDetailId?: string;

}
export type IDetail = {
    id?: string;
    tips: ITip[];
}