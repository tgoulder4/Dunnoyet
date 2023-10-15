import React from "react";
import { Plus } from "lucide-react";
import { useState, useCallback } from "react";
import Dropzone from "react-dropzone";
import { ruda, merriweather } from "@/app/fonts";
import Faq from "./Faq";

type Props = {};

const AddMoreFiles = (props: Props) => {
  return (
    <>
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
                <h2 className={` text-[1rem] ${merriweather.className}`}>
                  Add a file
                </h2>
              </div>
            </div>
          </>
        )}
      </Dropzone>
    </>
  );
};

export default AddMoreFiles;
