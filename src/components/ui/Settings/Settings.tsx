import React from "react";
import { Button } from "../button";
import { sizing, spacing } from "@/lib/constants";
import NewButton from "../NewButton";

type Props = {};

const Settings = (props: Props) => {
  return (
    <div style={{ fontSize: sizing.globalFontSize }} className="px-6 py-4 flex">
      {/*buttons!*/}
      <div className="flex flex-col">
        <button className="hover:bg-slate-300 transition-colors rounded-[10px] py-[14px] px-[28px]"
        >
          Questions
        </button>
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
