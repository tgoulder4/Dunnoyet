import React from "react";
import { FileText, Trash2 } from "lucide-react";
import { ruda } from "@/app/fonts";
import { useState } from "react";
import { Button } from "./button";

type Props = {
  key: number;
  subject: string;
  uploadedAt: string;
};

const File = ({ key, subject, uploadedAt }: Props) => {
  const [hovering, setHovering] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={` hover:bg-[#f3f3f3] outline outline-1  outline-[#e2e2e2]  w-full px-2 py-4 rounded-lg flex justify-between items-center`}
    >
      <div className="flex justify-between gap-4">
        <FileText className="h-12 w-12 stroke-1" />
        <summary className={`${ruda.className} flex flex-col gap-0.5`}>
          <h3 className={`font-bold`}>{subject}</h3>
          <p>PDF | {uploadedAt}</p>
        </summary>
      </div>
      {hovering ? (
        <>
          <Button variant="ghost" tooltip="Delete file">
            <Trash2 id={`select-${key}`} className="w-6 h-6" />
          </Button>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default File;
