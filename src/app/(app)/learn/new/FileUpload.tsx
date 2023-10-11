import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";

type Props = {};

const FileUpload = (props: Props) => {
  return (
    <div>
      FileUploadaaa
      <Link href="/learn/test">
        <Button>Upload</Button>
      </Link>
    </div>
  );
};

export default FileUpload;
