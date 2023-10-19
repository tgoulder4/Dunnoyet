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
import { Checkbox } from "./checkbox";
import File from "./File";
import UploadFile from "./UploadFile";

type Props = {
  key?: number;
  subject: string;
  date: string;
  noOfDocuments: number;
  setNewQuestionIsVisible?: Function;
  // _expanded: boolean;
};

const Source = ({
  key,
  subject,
  date,
  noOfDocuments,
  setNewQuestionIsVisible,
}: // _expanded = false,
Props) => {
  const [expanded, setExpanded] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [selected, setSelected] = useState(false);
  const [files, setFiles] = useState([
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

  function toggleSelected() {
    setSelected(!selected);
    if (setNewQuestionIsVisible === undefined) return;
    setNewQuestionIsVisible(true);
  }

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
        className={`${
          !selected
            ? "hover:bg-[#f4f4ff] outline bg-[#FFFFFF] outline-[#efefef]"
            : "outline outline-2 bg-[#ECEEFF]"
        } outline-[#888FCE]  w-full px-2 py-4 rounded-lg flex justify-between items-center`}
      >
        <div className="flex justify-between gap-4" onClick={toggleSelected}>
          <Files className="h-12 w-12 stroke-1" />
          <summary className={`${ruda.className} flex flex-col gap-0.5 pr-20`}>
            <h3 className={`${expanded ? "font-extrabold" : "font-bold"}`}>
              {subject}
            </h3>
            <p>
              {noOfDocuments} Documents - {date}
            </p>
          </summary>
        </div>
        <div className="controls flex gap-4 items-center">
          <Checkbox
            className={`h-8 w-8 stroke-1 `}
            checked={selected}
            onClick={toggleSelected}
          />
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
      </div>
      {loadingFiles ? (
        <>
          <div
            className={`outline outline-1  outline-[#e2e2e2]  w-full px-2 py-4 rounded-lg flex justify-between items-center ml-4`}
          >
            <div className="flex justify-between gap-4">
              <FileText className="h-12 w-12 stroke-0" />
              <summary className={`${ruda.className} flex flex-col gap-2`}>
                <div className="rounded-lg animate-pulse bg-gray-200 h-5 w-72"></div>
                <div className="rounded-lg animate-pulse bg-gray-200 h-5 w-16"></div>
              </summary>
            </div>
          </div>
        </>
      ) : expanded ? (
        <div className="pl-4">
          <div className="flex flex-col gap-3">
            {files.map((file, index) => (
              <File key={index} subject={file.subject} date={file.date} />
            ))}
            <UploadFile />
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Source;
