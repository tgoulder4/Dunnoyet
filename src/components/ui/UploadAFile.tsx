"use client";
import React from "react";
import { ArrowRight, Plus } from "lucide-react";
import Dropzone from "react-dropzone";
import { ruda, merriweather } from "@/app/fonts";
import Faq from "./Faq";
import { Button } from "./button";
import { Input } from "@/components/ui/input";
type Props = {};

const UploadAFile = (props: Props) => {
  return (
    <>
      <Input
        placeholder="Enter a title for this source"
        className={`${ruda.className}`}
      />
      <Dropzone onDrop={(acceptedFiles) => console.log(acceptedFiles)}>
        {({ getRootProps, getInputProps }) => (
          <>
            <input
              className="flex flex-col items-center"
              {...getInputProps()}
            />
            <div
              className={`border border-dashed border-gray-400 grid place-items-center h-24 bg-white hover:bg-slate-100 rounded-md`}
              {...getRootProps()}
            >
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
        )}
      </Dropzone>
      <div className="controls flex justify-between">
        <Button variant="grey" className={`${ruda.className}`}>
          <h3 className="font-bold">Upload</h3>
        </Button>
        <Button
          variant="primary"
          tooltip="Upload this file"
          className={`bg-indigo-600 hover:bg-indigo-500 ${ruda.className}`}
        >
          <ArrowRight className="h-8 w-8 stroke-2" color="#FFFFFF" />
        </Button>
      </div>
    </>
  );
};

export default UploadAFile;
