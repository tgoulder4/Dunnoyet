import { ruda } from "@/app/fonts";
import React, { useState } from "react";
import { Button } from "./button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

type Props = {
  question: string;
  subject: string;
  date: string;
};

const Conversation = ({ question, subject, date }: Props) => {
  const [selected, setSelected] = useState(false);
  function toggleSelected() {
    setSelected(!selected);
  }
  return (
    <div
      onClick={toggleSelected}
      className={`${ruda.className} ${!selected ? "hover:bg-[#f4f4ff]" : ""} ${
        selected ? "outline outline-2 bg-[#ECEEFF]" : "bg-[#FFFFFF]"
      } outline-[#888FCE]  w-full px-4 py-4 rounded-lg flex justify-between items-center`}
    >
      {question}
      <Link href="/learn/The+Bourbon+Monarch" onClick={toggleSelected}>
        <Button variant="grey">
          <ArrowRight className="h-6 w-6 stroke-1" />
        </Button>
      </Link>
    </div>
  );
};

export default Conversation;
