"use client";
import React, { useState, useCallback } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { ruda, merriweather } from "@/app/fonts";
import UploadedFile from "./File";
import { Input } from "./input";
import { Button } from "./button";
import Faq from "./Faq";

type Props = {};

const UploadAFile = (props: Props) => {
  const [uploadSuccessful, setUploadSuccessful] = useState(false); // TODO: Implement this
  const [source, setSource] = useState({
    name: "",
    files: [
      {
        name: "",
        subject: "safhsasa",
        date: "",
      },
    ],
  });
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        console.log(binaryStr);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);
  const { getRootProps, getInputProps } = useDropzone();
  return (
    <div className="flex flex-col gap-2">
      {!uploadSuccessful ? (
        <>
          <div className="flex gap-2">
            <Input
              placeholder="Topic name (e.g. Electromagnetism)"
              className={`${ruda.className}`}
            />
            <Button
              variant="primary"
              tooltip="Done"
              className={`bg-indigo-600 hover:bg-indigo-500 ${ruda.className}`}
            >
              <ArrowRight className="h-8 w-8 stroke-2" color="#FFFFFF" />
            </Button>
          </div>
          <div
            className={`border border-dashed border-gray-400 grid place-items-center h-24 bg-white hover:bg-slate-100 rounded-md`}
            {...getRootProps({})}
          >
            <input
              className="flex flex-col items-center"
              {...getInputProps()}
            />

            <div className="flex flex-col items-center gap-2">
              <Plus className="h-8 w-8 stroke-1" />
              <h2
                className={` text-[1rem] ${merriweather.className} select-none`}
              >
                Upload a file
              </h2>
            </div>
          </div>
          <article className={`${ruda.className}`}>
            <h3>
              The knowledge you'll gain is the content you upload - add
              trustworthy sources! Supported formats include:
            </h3>
            <ul>
              <li>• Lectures, YouTube videos, any other videos</li>
              <li>• Any websites</li>
            </ul>
          </article>
          <Faq />
        </>
      ) : (
        <>
          {source.files.map((file, index) => (
            <UploadedFile key={index} subject={file.subject} date={file.date} />
          ))}
        </>
      )}
    </div>
  );
};

export default UploadAFile;
