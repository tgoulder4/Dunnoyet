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
      expanded: false,
    },
    {
      subject: "The Normal Distribution",
      date: "Just now",
      noOfDocuments: 1,
      expanded: false,
    },
  ]);

  const handleSourceExpand = (index: number) => {
    const newSourceGroups = sourceGroups.map((source, i) => {
      if (i === index) {
        return { ...source, expanded: true };
      } else {
        return { ...source, expanded: false };
      }
    });
    setSourceGroups(newSourceGroups);
  };

  return (
    <div className="flex flex-col gap-3">
      {sourceGroups.map((file, index) => (
        <Source
          noOfDocuments={file.noOfDocuments}
          key={index}
          subject={file.subject}
          date={file.date}
          _expanded={file.expanded}
          handleSourceExpand={handleSourceExpand}
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
