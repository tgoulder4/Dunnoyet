"use client";
import React from "react";
import { useState } from "react";
import Source from "./Source";
import { merriweather } from "@/app/fonts";
import { getSources } from "@/app/(api)/sources";
type Props = {
  setNewQuestionIsVisible: Function;
  sources: {
    id: string;
    subject: string;
    noOfDocuments: number;
    date: string;
    files: {
      name: string;
      type: string;
      uploadedAt: string;
    }[];
  }[];
};

const Sources = ({ setNewQuestionIsVisible, sources }: Props) => {
  return (
    <div className="flex flex-col gap-3">
      {sources.map((source, index) => (
        <Source
          noOfDocuments={source.noOfDocuments}
          key={index}
          subject={source.subject}
          date={source.date}
          files={source.files}
          setNewQuestionIsVisible={setNewQuestionIsVisible}
        />
      ))}
    </div>
  );
};

export default Sources;
