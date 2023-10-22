"use client";
import React, { useState, useCallback, useRef } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { ruda, merriweather } from "@/app/fonts";
import { Input } from "./input";
import { Button } from "./button";
import Faq from "./Faq";
import Source from "./Source";
import { toast } from "sonner";

type Props = {
  setSources: Function;
};
let createdSourcesCount = 0;
const CreateASource = (props: Props) => {
  const [sourceName, setSourceName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [newFiles, setNewFiles] = useState([
    {
      name: "hfdhfd",
      type: "PDF",
      uploadedAt: "sdg",
    },
  ]);
  function handleDone() {
    if (!sourceName || !newFiles.length) {
      inputRef.current?.focus();
      toast.error("Please enter a topic name and upload at least one file", {
        className: "bg-red-500 text-white" + ruda.className,
      });
    } else {
      toast.success(`Source '${sourceName}' created!`);

      props.setSources((prev: any) => [
        ...prev,
        {
          id: Math.random().toString(),
          subject: sourceName,
          noOfDocuments: newFiles.length,
          date: "Just now",
          files: newFiles,
        },
      ]);
    }
  }
  return (
    <div className="flex flex-col gap-2">
      <>
        <div className="flex gap-2">
          <Input
            placeholder="Topic name (e.g. Electromagnetism)"
            className={`${ruda.className}`}
            onChange={(e) => setSourceName(e.target.value)}
            ref={inputRef}
          />

          <Button
            variant="primary"
            tooltip="Done"
            className={`bg-indigo-600 hover:bg-indigo-500 ${ruda.className}`}
            onClick={handleDone}
          >
            <ArrowRight className="h-8 w-8 stroke-2" color="#FFFFFF" />
          </Button>
        </div>
        {newFiles.length > 0 || sourceName !== "" ? (
          <>
            <Source
              key={createdSourcesCount++}
              files={newFiles}
              subject={sourceName}
              lastUsed="Just now"
              _expandable={false}
              noOfDocuments={newFiles.length}
              _expanded={true}
              _uploadOption={true}
              _selectable={false}
            />
          </>
        ) : (
          <></>
        )}
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
