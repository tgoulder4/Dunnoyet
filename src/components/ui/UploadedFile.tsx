import React from "react";
import { FileText } from "lucide-react";
import { ruda } from "@/app/fonts";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

type Props = {
  key: number;
  subject: string;
  date: string;
  noOfDocuments: number;
};

const UploadedFile = ({ key, subject, date, noOfDocuments }: Props) => {
  const [selected, setSelected] = useState(false);
  function toggleSelected() {
    setSelected(!selected);
  }
  return (
    <div
      onClick={toggleSelected}
      className={` hover:bg-[#f3f3f3] ${
        selected ? "outline outline-2" : ""
      } outline-[#888FCE]  w-full px-2 py-4 rounded-lg flex justify-between items-center`}
    >
      <div className="flex justify-between gap-4">
        <FileText className="h-12 w-12 stroke-1" />
        <summary className={`${ruda.className} flex flex-col gap-0.5`}>
          <h3 className={`${selected ? "font-extrabold" : "font-bold"}`}>
            {subject}
          </h3>
          <p>
            {noOfDocuments} Documents - {date}
          </p>
        </summary>
      </div>

      <Checkbox
        id={`select-${key}`}
        className="w-8 h-8"
        checked={selected}
        onChange={toggleSelected}
      />
    </div>
  );
};

export default UploadedFile;
