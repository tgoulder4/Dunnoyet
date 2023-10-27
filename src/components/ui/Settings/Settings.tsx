import React from "react";
import { Button } from "../button";

type Props = {};

const Settings = (props: Props) => {
  return (
    <div className="px-6 py-4 flex">
      {/*buttons!*/}
      <div className="flex flex-col">
        <Button
          variant="ghost"
          className="hover:bg-gray-200 w-full !justify-start !py-2"
          size="tighter"
        >
          Questions
        </Button>{" "}
        {/*x questions asked, y concepts learnt, keep learning!*/}
        <Button
          variant="ghost"
          className="hover:bg-gray-200 w-full !justify-start"
          size="tighter"
        >
          Billing
        </Button>{" "}
        {/*x questions every month at y price*/}
      </div>
    </div>
  );
};

export default Settings;
