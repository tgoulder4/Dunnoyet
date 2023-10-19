"use client";
import React, { useState, useCallback } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { ruda, merriweather } from "@/app/fonts";
import UploadedFile from "./File";
import { Input } from "./input";
import { Button } from "./button";
import Faq from "./Faq";
import { Files } from "lucide-react";

type Props = {};

const UploadFile = (props: Props) => {
  const { getRootProps, getInputProps } = useDropzone();
  return (
    <div className="flex flex-col gap-2">
      <>
        <div
          className={`border border-dashed border-gray-400 grid place-items-center h-24 bg-white hover:bg-slate-100 rounded-md`}
          {...getRootProps({})}
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
        <hr className="border-gray-400" />
      </>
    </div>
  );
};

export default UploadFile;
