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
      {Sources.map((source, index) => {
        if (index !== 0)
          return (
            <Source
              key={index}
              files={source.files}
              subject={source.subject}
              noOfDocuments={source.noOfDocuments}
              lastUsed={source.lastUsed}
              setNewQuestionIsVisible={setNewQuestionIsVisible}
              setActiveIndex={setActiveIndex}
              appearanceMods={{ _expanded: index == activeIndex }}
            />
          );
      })}
    </div>
  );
};

export default Sources;
