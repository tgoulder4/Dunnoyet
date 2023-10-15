import React from "react";
import { FileText, Trash2 } from "lucide-react";
import { ruda } from "@/app/fonts";
import { useState } from "react";
import { Button } from "./button";

type Props = {
  key: number;
  subject: string;
  date: string;
};

const UploadedFile = ({ key, subject, date }: Props) => {
  const [selected, setSelected] = useState(false);
  const [hovering, setHovering] = useState(false);
  function toggleSelected() {
    setSelected(!selected);
  }
  return (
    <div
      onClick={toggleSelected}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={` hover:bg-[#f3f3f3] outline outline-1 ${
        selected ? "outline outline-2" : ""
      } outline-[#e2e2e2]  w-full px-2 py-4 rounded-lg flex justify-between items-center`}
    >
      <div className="flex justify-between gap-4">
        <FileText className="h-12 w-12 stroke-1" />
        <summary className={`${ruda.className} flex flex-col gap-0.5`}>
          <h3 className={`${selected ? "font-extrabold" : "font-bold"}`}>
            {subject}
          </h3>
          <p>{date}</p>
        </summary>
      </div>
      {hovering ? (
        <>
          <Button variant="ghost" tooltip="Delete file">
            <Trash2
              id={`select-${key}`}
              className="w-6 h-6"
              onChange={toggleSelected}
            />
          </Button>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default UploadedFile;
