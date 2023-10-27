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
  noOfDocuments: number;
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
};
export type IUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  threads: string[];
};
let threads: IThread[] = [
  {
    id: "0",
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
    sourceID: ["0"],
    lastUsed: "Just now",
  },
  {
    id: "1F2B3C4D5E6F7G8H9I0J",
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
    sourceID: ["1F2B3C4D5E6F7G8H9I0J"],
    lastUsed: "Just now",
  },
];
let users: IUser[] = [
  {
    id: "0",
    name: "Test",
    email: "",
    password: "",
    threads: ["0"],
  },
  {
    id: "1F2B3C4D5E6F7G8H9I0J",
    name: "Tye",
    email: "test@gmail.com",
    password: "testpassword",
    threads: ["1F2B3C4D5E6F7G8H9I0J"],
  },
  {
    id: "1F2B3C4D5E6F7G8H9I0J",
    name: "Tye",
    email: "test@gmail.com",
    password: "testpassword",
    threads: [],
  },
];
let files: IFile[] = [
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
];
let sources: ISource[] = [
  {
    id: "0",
    userID: "0",
    subject: "NewSrcTest",
    lastUsed: "N/A",
    noOfDocuments: 0,
    files: ["0", "1F2B3C4D5E6F7G8H9I0J"],
  },
  {
    id: "1F2B3C4D5E6F7G8H9I0J",
    userID: "1F2B3C4D5E6F7G8H9I0J",
    subject: "NewSrcTest",
    lastUsed: "N/A",
    noOfDocuments: 0,
    files: ["1F2B3C4D5E6F7G8H9I0J"],
  },
];
export function setSources(_sources: ISources): void {
  setTimeout(() => {}, 2000);
  sources = _sources;
}
export async function addSource(source: ISource): Promise<void> {
  await setTimeout(() => {}, 2000);
  sources.push(source);
}
export function addFileToSource(sourceID: string, file: IFile): void {
  setTimeout(() => {}, 2000);
  const source: ISource | undefined = sources.find(
    (source) => source.id === sourceID
  );
  if (source) {
    source.files.push(file);
  }
}
export function getSources(): ISources {
  setTimeout(() => {}, 2000);
  return sources;
}
export function getSourceByID(id: string): ISource {
  setTimeout(() => {}, 2000);
  const result: ISource | undefined = sources.find(
    (source) => source.id === id
  );
  if (result) {
    return result;
  } else {
    return mockSource;
  }
}
