"use client";
import { ArrowRight, Plus } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { ruda, merriweather } from "@/app/fonts";
import React, { useCallback } from "react";
import { IFile, addFileToDatabase } from "@/lib/Actions/actions";

type Props = {
  addFileToTheNewSource: (file: IFile) => void;
  sourceID: string;
};

const UploadFile = (props: Props) => {
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    accept: "application/pdf";
    maxFiles: 5;
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles);
    };
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const file: IFile = {
    id: Math.random().toString(),
    sourceID: props.sourceID,
    name: "Test",
    uploadedAt: "Today",
    type: "pdf",
  };
  function saveUpload() {
    addFileToDatabase(file);
    props.addFileToTheNewSource(file);
  }
  return (
    <div className="flex flex-col gap-2">
      <>
        <div
          className={`border border-dashed border-gray-400 grid place-items-center h-24 bg-white hover:bg-slate-100 rounded-md`}
          {...getRootProps({})}
          onClick={saveUpload}
        >
          <input className="flex flex-col items-center" {...getInputProps()} />

          <div className="flex flex-col items-center gap-2">
            <Plus className="h-8 w-8 stroke-1" />
            <h2
              className={` text-[1rem] ${merriweather.className} select-none`}
            >
              Upload a file
            </h2>
          </div>
        </div>
      </>
    </div>
  );
};

export default UploadFile;
