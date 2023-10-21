type File = {
  subject: string;
  uploadedAt: string;
  noOfDocuments: number;
};
type Source = {
  id: string;
  name: string;
  noOfDocuments: number;
  files: File[];
};
export function getSources() {
  return [
    {
      id: "1",
      subject: "Bourbon Monarchy",
      noOfDocuments: 2,
      date: "Just now",
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
}
