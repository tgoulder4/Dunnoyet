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