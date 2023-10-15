"use client";
import React from "react";
import { useState } from "react";
import UploadedFile from "./UploadedFile";
import AddMoreSources from "./AddMoreSources";
import AddMoreFiles from "./AddMoreFiles";
type Props = {};

const UploadedFiles = (props: Props) => {
  const [thisGroupsFiles, setThisGroupsFiles] = useState([
    {
      subject: "The Bourbon Restoration",
      date: "Just now",
      noOfDocuments: 5,
    },
    {
      subject: "Bourbon Monarchy",
      date: "Just now",
      noOfDocuments: 1,
    },
  ]);
  return (
    <div className="flex flex-col gap-3">
      {thisGroupsFiles.map((file, index) => (
        <UploadedFile key={index} subject={file.subject} date={file.date} />
      ))}
      <AddMoreFiles />
    </div>
  );
};

export default UploadedFiles;
