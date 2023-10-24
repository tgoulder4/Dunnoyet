export type IFile = {
  name: string;
  uploadedAt: string;
  type: string;
};
export type ISource = {
  id: string;
  subject: string;
  noOfDocuments: number;
  lastUsed: string;
  files: IFile[];
};
export type ISources = ISource[];
let sources: ISources = [
  {
    id: "0",
    subject: "Test",
    lastUsed: "Just now",
    noOfDocuments: 2,
    files: [
      {
        name: "The_Bourbon_Restoration",
        type: "PDF",
        uploadedAt: "Just now",
      },
      {
        name: "The_Bourbons_in_Italy",
        type: "PDY",
        uploadedAt: "Just now",
      },
    ],
  },
  {
    id: "1F2B3C4D5E6F7G8H9I0J",
    subject: "Test",
    lastUsed: "Just now",
    noOfDocuments: 2,
    files: [
      {
        name: "The_Bourbon_Restoration",
        type: "PDF",
        uploadedAt: "Just now",
      },
      {
        name: "The_Bourbons_in_Italy",
        type: "PDY",
        uploadedAt: "Just now",
      },
    ],
  },
];
let mockSource: ISource = {
  id: "0",
  subject: "N/A",
  lastUsed: "-",
  noOfDocuments: 0,
  files: [
    {
      name: "File 1",
      type: "PDF",
      uploadedAt: "-",
    },
    {
      name: "File 2",
      type: "PDF",
      uploadedAt: "-",
    },
  ],
};
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
