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
  files: File[];
};
export type ISources = ISource[];
let sources = [
  {
    id: "1",
    subject: "Bourbon Monarchy",
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
export function setSources(sources: ISources) {
  sources = sources;
}
export function getSources() {
  return sources;
}
