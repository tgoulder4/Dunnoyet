"use client";
import React, { useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import Dropzone from "react-dropzone";
import { ruda, merriweather } from "@/app/fonts";
import Faq from "./Faq";
import { Button } from "./button";
import { Input } from "@/components/ui/input";
type Props = {};

const UploadAFile = (props: Props) => {
  const [uploadSuccessful, setUploadSuccessful] = useState(false); // TODO: Implement this
  let uploadedSource = {
    name: "",
    files: [
      {
        name: "",
        type: "",
      },
    ],
  };
  return (
    <>
      {!uploadSuccessful ? (
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
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default UploadAFile;
