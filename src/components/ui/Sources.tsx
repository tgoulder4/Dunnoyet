"use client";
import React from "react";
import { useState } from "react";
import Source from "./Source";
import { ISources, getSources } from "@/app/(api)/sources";
type Props = {
  setNewQuestionIsVisible: Function;
};

const Sources = ({ setNewQuestionIsVisible }: Props) => {
  const Sources: ISources = getSources();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  return (
    <div className="flex flex-col gap-3">
      {Sources.map((source, index) => (
        <Source
          noOfDocuments={source.noOfDocuments}
          key={index}
          lastUsed={source.lastUsed}
          subject={source.subject}
          files={source.files}
          setNewQuestionIsVisible={setNewQuestionIsVisible}
          setActiveIndex={setActiveIndex}
          _expanded={index == activeIndex}
        />
      ))}
    </div>
  );
};

export default Sources;
