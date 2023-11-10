//SCHEMAS
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
  threads: string[];
};
//DATA
const threads: IThread[] = [
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
let userID = "1F2B3C4D5E6F7G8H9I0J";
export function getCurrentUserID() {
  return userID;
}
export function getFilesByFileIDs(fileIDs: string[]): IFile[] {
  const result: IFile[] = [];
  fileIDs.forEach((fileID) => {
    const file = files.find((file) => file.id === fileID);
    if (file) {
      result.push(file);
    }
  });
  return result;
}
const users: IUser[] = [
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
    id: "1G2B3C4A5E6F7G8H9I0J",
    name: "Goulder",
    email: "test@gmail.com",
    password: "testpassword",
    threads: ["2K3L4M5N6O7P8Q9R0S"],
  },
];
const files: IFile[] = [
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
const sources: ISource[] = [
  {
    id: "0",
    userID: "0",
    subject: "NewSrcTest",
    lastUsed: "N/A",
    files: ["0", "1F2B3C4D5E6F7G8H9I0J"],
  },
  {
    id: "4C5D6E7F8G9H0I1J2K",
    userID: "1G2B3C4A5E6F7G8H9I0J",
    subject: "TestSrc",
    lastUsed: "Just Now",
    files: ["2H2B3C4D5E6F7G8H9I0J"],
  },
  {
    id: "1F2B3C4D5E6F7G8H9I0J",
    userID: "1F2B3C4D5E6F7G8H9I0J",
    subject: "The Bourbon Restoration",
    lastUsed: "Just Now",
    files: ["1F2B3C4D5E6F7G8H9I0J"],
  },
];
//MANIPULATION
export function getUserWhereIdIs(id: string): IUser | null {
  setTimeout(() => {}, 2000);
  const result: IUser | undefined = users.find((user) => user.id === id);
  if (result) {
    return result;
  } else {
    return null;
  }
}
export async function addFileToDatabase(_file: IFile): Promise<void> {
  setTimeout(() => {}, 2000);
  files.push(_file);
}
export function getFileFromDatabaseWhereIdIs(id: string): IFile | null {
  setTimeout(() => {}, 2000);
  const result: IFile | undefined = files.find((file) => file.id === id);
  if (result) {
    return result;
  } else {
    return null;
  }
}
export function getThreadsByUserId(id: string): IThread[] {
  setTimeout(() => {}, 2000);
  const result: IThread[] = threads.filter((thread) =>
    thread.sourceID.includes(id)
  );
  return result;
}
export function getMessagesFromDatabaseWhereThreadIdIs(threadID: string) {
  setTimeout(() => {}, 2000);
  const result: IThread | undefined = threads.find(
    (thread) => thread.id === threadID
  );
  if (result) {
    return result.messages;
  } else {
    return null;
  }
}
export function getSources(userID: string): ISource[] {
  setTimeout(() => {}, 2000);
  const result: ISource[] = sources.filter(
    (source) => source.userID === userID
  );
  return result;
}
export async function addSourceToAUsersSources(
  userID: string,
  source: ISource
): Promise<void> {
  setTimeout(() => {}, 2000);
  sources.push(source);
}
export async function pushSourceToDatabase(_source: ISource): Promise<void> {
  setTimeout(() => {}, 2000);
  sources.push(_source);
}
export async function getSourceFromDatabaseWhereSourceIdIs(
  id: string
): Promise<ISource | null> {
  setTimeout(() => {}, 2000);
  const result: ISource | undefined = sources.find(
    (source) => source.id === id
  );
  if (result) {
    return result;
  } else {
    return null;
  }
}
export function getFilesFromDatabaseFromSourceId(
  id: string
): Array<IFile | null> {
  setTimeout(() => {}, 2000);
  const matchingSourceByID: ISource | undefined = sources.find(
    (source) => source.id === id
  );
  if (matchingSourceByID === undefined) {
    return [];
  }
  const finalFiles = matchingSourceByID.files.map((fileID) => {
    let _file = files.find((file) => file.id === fileID);
    if (_file) {
      return _file;
    } else {
      //null implies that the corresponding file was not found in the files array. this should never happen unless improperly configured
      return null;
    }
  });
  return finalFiles;
}
