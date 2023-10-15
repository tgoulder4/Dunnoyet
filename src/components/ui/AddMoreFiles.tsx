import React from "react";
import { Plus } from "lucide-react";
import { useState, useCallback } from "react";
import Dropzone from "react-dropzone";
import { ruda, merriweather } from "@/app/fonts";
import Faq from "./Faq";

type Props = {};

const AddMoreFiles = (props: Props) => {
  const [newSourceButtonClicked, setNewSourceButtonClicked] = useState(false);

  return (
    <>
      {!newSourceButtonClicked ? (
        <div
          className={`bg-accentGrey hover:bg-accentGrey/80 w-full px-2 py-4 rounded-lg grid place-items-center`}
          onClick={() => setNewSourceButtonClicked(true)}
        >
          <Plus className="h-9 w-9 stroke-1" />

          <h2 className={` text-[1rem] ${merriweather.className}`}>
            Add a file
          </h2>
        </div>
      ) : (
        <>
          <Dropzone onDrop={(acceptedFiles) => console.log(acceptedFiles)}>
            {({ getRootProps, getInputProps }) => (
              <>
                <input
                  className="flex flex-col items-center"
                  {...getInputProps()}
                />
                <div
                  className={`border border-dashed border-gray-400 grid place-items-center h-24 bg-white rounded-md`}
                  onClick={() => setNewSourceButtonClicked(true)}
                  {...getRootProps()}
                >
                  <h2 className={` text-[1rem] ${merriweather.className}`}>
                    Upload here
                  </h2>
                </div>
              </>
            )}
          </Dropzone>
        </>
      )}
    </>
  );
};

export default AddMoreFiles;
