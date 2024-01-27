import { IFile, IThread, IUser } from "./types";
export const threads: IThread[] = [
    {
        id: "0",
        sourceID: ["0"],
        lastUsed: "Just now",
        subject: "A cute roleplay",

        messages: [
            {
                content: "Hello",
                type: "Question",
            },
            {
                content: "Hi",
                type: "Response",
            },
        ],
    },
    {
        id: "1F2B3C4D5E6F7G8H9I0J",
        sourceID: ["1F2B3C4D5E6F7G8H9I0J"],
        lastUsed: "Just now",
        subject: "Another cute roleplay",
        messages: [
            {
                content: "Hello",
                type: "Question",
            },
            {
                content: "Hi",
                type: "Response",
            },
        ],
    },
    {
        id: "2K3L4M5N6O7P8Q9R0S",
        sourceID: ["2K3L4M5N6O7P8Q9R0S"],
        lastUsed: "Just now",
        subject: "Yet another cute roleplay",
        messages: [
            {
                content: "How are you?",
                type: "Question",
            },
            {
                content: "I'm doing well, thanks for asking!",
                type: "Response",
            },
        ],
    },
    {
        id: "3T4U5V6W7X8Y9Z0A1B",
        sourceID: ["3T4U5V6W7X8Y9Z0A1B"],
        lastUsed: "Just now",
        subject: "Yet another cute roleplay",
        messages: [
            {
                content: "What's your favorite color?",
                type: "Question",
            },
            {
                content:
                    "I don't really have a favorite color, but I like blue and green.",
                type: "Response",
            },
        ],
    },
    {
        id: "4C5D6E7F8G9H0I1J2K",
        sourceID: ["4C5D6E7F8G9H0I1J2K"],
        lastUsed: "Just now",
        subject: "Yet another cuter roleplay",
        messages: [
            {
                content: "What's your favorite food?",
                type: "Question",
            },
            {
                content: "I like pizza and sushi.",
                type: "Response",
            },
        ],
    },
];
export const users: IUser[] = [
    {
        id: "0",
        name: "Test",
        email: "",
        password: "",
        threads: [{ threadQuestion: "The Bourbon Monarch", threadID: "0" }],
    },
    {
        id: "1F2B3C4D5E6F7G8H9I0J",
        name: "Tye",
        email: "test@gmail.com",
        password: "testpassword",
        threads: [
            { threadQuestion: "Another cute roleplay", threadID: "1F2B3C4D5E6F7G8H9I0J" }
        ],
    },
    {
        id: "1G2B3C4A5E6F7G8H9I0J",
        name: "Goulder",
        email: "test@gmail.com",
        password: "testpassword",
        threads: [
            { threadQuestion: "Yet another cute roleplay", threadID: "2K3L4M5N6O7P8Q9R0S" }
        ],
    },
];
export const files: IFile[] = [
    {
        id: "0",
        sourceID: "0",
        name: "File 1",
        uploadedAt: "Just now",
        type: "PDF",
    },
    {
        id: "1F2B3C4D5E6F7G8H9I0J",
        sourceID: "1F2B3C4D5E6F7G8H9I0J",
        name: "File 2",
        uploadedAt: "Just now",
        type: "PDF",
    },
    {
        id: "2H2B3C4D5E6F7G8H9I0J",
        sourceID: "1F2B3C4D5E6F7G8H9I0J",
        name: "File 2",
        uploadedAt: "Just now",
        type: "PDF",
    },
];
