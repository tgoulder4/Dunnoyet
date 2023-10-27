"use client";
import { ArrowRight, Plus } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { ruda, merriweather } from "@/app/fonts";
import {
  setSources,
  IFile,
  getSources,
  ISources,
  getSourceByID,
} from "@/app/(api)/api";

type Props = {
  callbackToRunOnceFinished: Function;
};

const UploadFile = (props: Props) => {
  const { getRootProps, getInputProps } = useDropzone();
  const file: IFile = {
    name: "Test",
    uploadedAt: "Today",
    type: "pdf",
  };
  function saveUpload() {
    getSourceByID("0").files.push(file);
    props.callbackToRunOnceFinished();
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
