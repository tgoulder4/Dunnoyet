"use client";
import React from "react";
import { useState } from "react";
import Source from "./Source";
import {
  IFile,
  ISource,
  getFilesFromDatabaseFromSourceId,
  getSourceFromDatabaseWhereSourceIdIs,
} from "@/app/(api)/Actions/actions";
type Props = {
  setNewQuestionIsVisible: Function;
  setUploadClicked?: Function;
  sources?: ISource[];
  sourceIDs?: string[];
  uploadClicked?: boolean;
};

const Sources = (props: Props) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [uploadClicked, setUploadClicked] = useState(props.uploadClicked);
  const [sources, setSources] = useState<ISource[]>(getSources());
  function getSources() {
    if (props.sources) {
      return props.sources;
    } else if (props.sourceIDs) {
      const sources: ISource[] = [];
      props.sourceIDs.forEach((sourceID) => {
        const sourceFromDB = getSourceFromDatabaseWhereSourceIdIs(sourceID);
        if (!sourceFromDB) {
          throw new Error(
            `No source was found in the database with the sourceID ${sourceID}`
          );
        }
        sources.push(sourceFromDB);
      });
      return sources;
    } else {
      throw new Error("No sources or sourceIDs were passed in");
    }
  }
  return (
    <div className="flex flex-col gap-3">
      {sources.map((source, index) => {
        const files: Array<IFile | null> = getFilesFromDatabaseFromSourceId(
          source.id
        );
        if (index !== 0)
          return (
            <Source
              index={index}
              source={source}
              files={files}
              setNewQuestionIsVisible={props.setNewQuestionIsVisible}
              setActiveIndex={setActiveIndex}
              appearanceMods={{ _expanded: index == activeIndex }}
            />
          );
      })}
    </div>
  );
};

export default Sources;
