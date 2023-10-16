import React from "react";
import { ruda, merriweather } from "@/app/fonts";
import Faq from "./Faq";
import UploadAFile from "./UploadAFile";

type Props = {};

const DropzoneAndFAQ = (props: Props) => {
  return (
    <>
      <UploadAFile />

      <article className={`${ruda.className}`}>
        <h3>
          The knowledge you'll gain is the content you upload - add trustworthy
          sources! Supported formats include:
        </h3>
        <ul>
          <li>• Lectures, YouTube videos, any other videos</li>
          <li>• Any websites</li>
        </ul>
      </article>
      <Faq />
    </>
  );
};

export default DropzoneAndFAQ;
