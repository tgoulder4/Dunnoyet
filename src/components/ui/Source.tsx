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
import { Checkbox } from "./checkbox";

type Props = {
  key: number;
  subject: string;
  date: string;
  noOfDocuments: number;
  // _expanded: boolean;
};

const Source = ({
  key,
  subject,
  date,
  noOfDocuments,
}: // _expanded = false,
Props) => {
  const [expanded, setExpanded] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [selected, setSelected] = useState(false);
  function toggleSelected() {
    setSelected(!selected);
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
          !selected ? "hover:bg-[#f4f4ff] outline outline-[#efefef]" : ""
        } ${
          expanded || loadingFiles || selected
            ? "outline outline-2 bg-[#ECEEFF]"
            : "bg-[#FFFFFF]"
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
        <div className="bg-accentGrey rounded-lg h-24"></div>
      ) : expanded ? (
        <div className="pl-4">
          <UploadedFiles />
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Source;
