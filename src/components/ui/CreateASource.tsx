"use client";
import React, { useState, useCallback, useRef } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { ruda, merriweather } from "@/app/fonts";
import { Input } from "./input";
import { Button } from "./button";
import Faq from "./Faq";
import Source from "./Source";
import { toast } from "sonner";
import {
  addSource,
  getSourceByID,
  ISource,
  getSources,
} from "@/app/(api)/sources";
import UploadFile from "./UploadFile";

type Props = {
  setSources: Function;
};
let createdSourcesCount = 0;
const CreateASource = (props: Props) => {
  const [sourceName, setSourceName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [newSource, setNewSource] = useState<ISource>(getSourceByID("0"));
  async function handleDone() {
    setLoading(true);
    if (!sourceName || !newSource.files.length) {
      inputRef.current?.focus();
      toast.error("Please enter a topic name and upload at least one file", {
        className: "bg-red-500 text-white" + ruda.className,
      });
    } else {
      toast.success(`Source '${sourceName}' created!`);

      await addSource({
        id: Math.random().toString(),
        subject: sourceName,
        noOfDocuments: newSource.files.length,
        lastUsed: "Just now",
        files: newSource.files,
      });
      props.setSources(getSources());
      setLoading(false);
    }
  }
  return (
    <>
      <h2 className={`font-black text-[1.5rem] ${merriweather.className}`}>
        New Source
      </h2>
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
              loading={loading}
            >
              <ArrowRight className="h-8 w-8 stroke-2" color="#FFFFFF" />
            </Button>
          </div>
          {newSource.files.length > 0 || sourceName !== "" ? (
            <>
              <Source
                key={createdSourcesCount++}
                subject={sourceName}
                noOfDocuments={newSource.noOfDocuments}
                lastUsed={newSource.lastUsed}
                files={newSource.files}
                _expandable={false}
                _expanded={true}
                _uploadOption={true}
                _selectable={false}
              />
              <UploadFile callbackToRunOnceFinished={handleDone} />
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
    </>
  );
};

export default CreateASource;
