"use client";
import React from "react";
import { useState } from "react";
import Source from "./Source";
import { merriweather } from "@/app/fonts";
import { getSources } from "@/app/(api)/sources";
type Props = {
  setNewQuestionIsVisible: Function;
};

const Sources = (props: Props) => {
  const [sources, setSources] = useState(getSources());
  return (
    <div className="flex flex-col gap-3">
      {sources.map((source, index) => (
        <Source
          noOfDocuments={source.noOfDocuments}
          key={index}
          subject={source.subject}
          date={source.date}
          files={source.files}
          setNewQuestionIsVisible={props.setNewQuestionIsVisible}
        />
      ))}
    </div>
  );
};

export default Sources;
