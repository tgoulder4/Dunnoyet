import React from "react";
import { ArrowRight, FileText } from "lucide-react";
import { ruda } from "@/app/fonts";
import { useState } from "react";
import UploadedFiles from "./UploadedFile";

type Props = {
  key: number;
  subject: string;
  date: string;
  noOfDocuments: number;
};

const UploadedSourceGroup = ({ key, subject, date, noOfDocuments }: Props) => {
  const [expanded, setExpanded] = useState(false);
  function toggleExpanded() {
    setExpanded(!expanded);
  }

  return (
    <>
      <div
        onClick={toggleExpanded}
        className={`bg-[#ECEEFF] hover:bg-[#EEEEFE] ${
          expanded ? "outline outline-2" : ""
        } outline-[#888FCE]  w-full px-2 py-4 rounded-lg flex justify-between items-center`}
      >
        <div className="flex justify-between gap-4">
          <FileText className="h-12 w-12 stroke-1" />
          <summary className={`${ruda.className} flex flex-col gap-0.5`}>
            <h3 className={`${expanded ? "font-extrabold" : "font-bold"}`}>
              {subject}
            </h3>
            <p>
              {noOfDocuments} Documents - {date}
            </p>
          </summary>
        </div>
        <ArrowRight
          id={`select-${key}`}
          className="w-8 h-8"
          onClick={toggleExpanded}

          //I want selected to invoke the checkbox being checked
        />
      </div>
      {expanded ? (
        <>
          <UploadedFiles
            subject={subject}
            date={date}
            noOfDocuments={noOfDocuments}
            key={key}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default UploadedSourceGroup;
