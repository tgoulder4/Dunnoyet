type File = {
  subject: string;
  date: string;
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
          subject: "The Bourbon Restoration",
          date: "Just now",
        },
        {
          subject: "Bourbon Monarchy",
          date: "Just now",
        },
      ],
    },
  ];
}
