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
import { IFile, ISource } from "@/app/(api)/api";
type Props = {
  key: number;
  subject: string;
  lastUsed: string;
  noOfDocuments: number;
  files: IFile[];
  appearanceMods: {
    _selectable?: boolean;
    _selected?: boolean;
    _expanded?: boolean;
    _expandable?: boolean;
  };
  setNewQuestionIsVisible?: Function;
  setActiveIndex?: Function;
};

const Source = ({
  key,
  subject,
  lastUsed,
  noOfDocuments,
  files,
  appearanceMods: {
    _selected = false,
    _expanded = false,
    _expandable = true,
    _selectable = true,
  },
  setActiveIndex,
  setNewQuestionIsVisible,
}: // _expanded = false,
Props) => {
  const [expanded, setExpanded] = useState(_expanded);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [selected, setSelected] = useState(_selected);

  function toggleSelected() {
    if (_selectable == false) return;
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
    if (setActiveIndex) setActiveIndex(key);
    console.log(`Active index: ${key}`);
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
            {subject == "" ? (
              <div className="rounded-lg animate-pulse bg-gray-200 h-5 w-72"></div>
            ) : (
              <h3 className={`${expanded ? "font-extrabold" : "font-bold"}`}>
                {subject}
              </h3>
            )}
            <p>
              {noOfDocuments} Documents - Last used {lastUsed}
            </p>
          </summary>
        </div>
        <div className="controls flex gap-4 items-center">
          {_selectable ? (
            <Checkbox
              className={`h-8 w-8 stroke-1 `}
              checked={selected}
              onClick={toggleSelected}
            />
          ) : (
            <></>
          )}
          {files.length > 0 ? (
            !expanded ? (
              loadingFiles ? (
                <>
                  <Loader2 className="animate-spin" color="#3c3c3c" />
                </>
              ) : (
                <>
                  {_expandable ? (
                    <>
                      <ChevronRight
                        id={`select-${key}`}
                        className="w-8 h-8"
                        onClick={toggleExpanded}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                </>
              )
            ) : (
              <>
                {_expandable ? (
                  <>
                    <ChevronDown
                      id={`select-${key}`}
                      className="w-8 h-8"
                      onClick={toggleExpanded}
                    />
                  </>
                ) : (
                  <></>
                )}
              </>
            )
          ) : (
            <></>
          )}
        </div>
      </div>
      {loadingFiles ? (
        <div className="pl-4">
          <div
            className={`outline outline-1  outline-[#e2e2e2]  w-full px-2 py-4 rounded-lg flex justify-between items-center`}
          >
            <div className="flex justify-between gap-4">
              <FileText className="h-12 w-12 stroke-0" />
              <summary className={`${ruda.className} flex flex-col gap-2`}>
                <div className="rounded-lg animate-pulse bg-gray-200 h-5 w-72"></div>
                <div className="rounded-lg animate-pulse bg-gray-200 h-5 w-16"></div>
              </summary>
            </div>
          </div>
        </div>
      ) : expanded ? (
        <div className="pl-4">
          <div className="flex flex-col gap-3">
            {files.map((file, index) => (
              <File
                key={index}
                type={file.type}
                name={file.name}
                uploadedAt={file.uploadedAt}
              />
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Source;
