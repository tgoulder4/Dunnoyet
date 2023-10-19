"use client";
import React, { useState, useCallback } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { ruda, merriweather } from "@/app/fonts";
import UploadedFile from "./File";
import { Input } from "./input";
import { Button } from "./button";
import Faq from "./Faq";
import { Files } from "lucide-react";
import UploadFile from "./UploadFile";

type Props = {};

const CreateASource = (props: Props) => {
  const [uploadSuccessful, setUploadSuccessful] = useState(false); // TODO: Implement this
  const [files, setFiles] = useState([
    {
      name: "",
      subject: "safhsasa",
      date: "",
    },
  ]);
  return (
    <div className="flex flex-col gap-2">
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
        {uploadSuccessful ? (
          <>
            {files.map((file, index) => (
              <UploadedFile
                key={index}
                subject={file.subject}
                date={file.date}
              />
            ))}
          </>
        ) : (
          <></>
        )}
        <UploadFile />
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
    </div>
  );
};

export default CreateASource;
