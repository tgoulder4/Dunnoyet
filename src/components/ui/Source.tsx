import React from "react";
import {
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
// import { IFile, ISource } from "@/lib/actions/actions";
type Props = {
  index: number;
  source: any;
  files: (any | null)[];
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
  index,
  source,
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
    if (setActiveIndex) setActiveIndex(index);
    console.log(`Active index: ${index}`);
    setLoadingFiles(!loadingFiles);
    setTimeout(() => {
      setLoadingFiles(false);
      setExpanded(!expanded);
    }, 2000);
  }

  if (!source)
    throw new Error(
      "'source' and/or 'files' couldn't be given their values as there was no sourceID given and _source and _files weren't passed to the Source.tsx component."
    );

  if (source == null) return <></>;
  return (
    <>
      <div
        className={`${!selected
          ? "hover:bg-[#f4f4ff] outline bg-[#FFFFFF] outline-[#efefef]"
          : "outline outline-2 bg-[#ECEEFF]"
          } outline-[#888FCE]  w-full px-2 py-4 rounded-lg flex justify-between items-center`}
      >
        <div className="flex justify-between gap-4" onClick={toggleSelected}>
          <Files className="h-12 w-12 stroke-1" />
          <summary className={`${ruda.className} flex flex-col gap-0.5 pr-20`}>
            {source.subject == "" ? (
              <div className="rounded-lg animate-pulse bg-gray-200 h-5 w-72"></div>
            ) : (
              <h3 className={`${expanded ? "font-extrabold" : "font-bold"}`}>
                {source.subject}
              </h3>
            )}
            <p>
              {source.files.length} Documents - Last used {source.lastUsed}
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
          {source.files.length > 0 ? (
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
                        id={`select-${index}`}
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
                      id={`select-${index}`}
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
            {files.map((file) => {
              if (!file) return <></>;
              return (
                <File
                  type={file.type}
                  name={file.name}
                  key={file.id}
                  uploadedAt={file.uploadedAt}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Source;
