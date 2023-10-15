"use client";
import React from "react";
import { useState } from "react";
import AddMoreSources from "./AddMoreSources";
import Source from "./Source";
import { merriweather } from "@/app/fonts";
type Props = {};

const Sources = (props: Props) => {
  const [sourceGroups, setSourceGroups] = useState([
    {
      subject: "The French Revolution",
      date: "Just now",
      noOfDocuments: 5,
    },
    {
      subject: "The Normal Distribution",
      date: "Just now",
      noOfDocuments: 1,
    },
  ]);
  return (
    <div className="flex flex-col gap-3">
      {sourceGroups.map((file, index) => (
        <Source
          noOfDocuments={file.noOfDocuments}
          key={index}
          subject={file.subject}
          date={file.date}
          _expanded={true}
        />
      ))}
      <hr className="h-[2px]" />
      <h2 className={`font-black text-[1.5rem] ${merriweather.className}`}>
        ...or add a new source
      </h2>
      <AddMoreSources />
    </div>
  );
};

export default Sources;
