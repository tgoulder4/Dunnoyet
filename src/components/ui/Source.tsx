import React from "react";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  FileText,
  Files,
  Loader2,
} from "lucide-react";
import { ruda } from "@/app/fonts";
import { useState } from "react";
import UploadedFiles from "./UploadedFiles";

type Props = {
  key: number;
  subject: string;
  date: string;
  noOfDocuments: number;
};

const UploadedSourceGroup = ({ key, subject, date, noOfDocuments }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);
  function toggleExpanded() {
    if (expanded) {
      setExpanded(false);
      setLoadingFiles(false);
      return;
    }
    setLoadingFiles(!loadingFiles);
    setTimeout(() => {
      setLoadingFiles(false);
      setExpanded(!expanded);
    }, 2000);
  }

  return (
    <>
      <div
        onClick={toggleExpanded}
        className={`bg-[#ECEEFF] hover:bg-[#EEEEFE] ${
          expanded || loadingFiles ? "outline outline-2" : ""
        } outline-[#888FCE]  w-full px-2 py-4 rounded-lg flex justify-between items-center`}
      >
        <div className="flex justify-between gap-4">
          <Files className="h-12 w-12 stroke-1" />
          <summary className={`${ruda.className} flex flex-col gap-0.5`}>
            <h3 className={`${expanded ? "font-extrabold" : "font-bold"}`}>
              {subject}
            </h3>
            <p>
              {noOfDocuments} Documents - {date}
            </p>
          </summary>
        </div>
        {!expanded ? (
          loadingFiles ? (
            <>
              <Loader2 className="animate-spin" color="#3c3c3c" />
            </>
          ) : (
            <>
              <ChevronRight
                id={`select-${key}`}
                className="w-8 h-8"
                onClick={toggleExpanded}
              />
            </>
          )
        ) : (
          <>
            <ChevronDown
              id={`select-${key}`}
              className="w-8 h-8"
              onClick={toggleExpanded}
            />
          </>
        )}
      </div>
      {loadingFiles ? (
        <div className="bg-accentGrey rounded-lg h-24"></div>
      ) : expanded ? (
        <>
          <UploadedFiles />
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default UploadedSourceGroup;
