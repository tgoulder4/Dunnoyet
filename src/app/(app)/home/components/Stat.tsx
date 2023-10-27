import { merriweather } from "@/app/fonts";
import React from "react";

type Props = {
  type: "questions" | "concepts";
};

const Stat = (props: Props) => {
  return (
    <div className={`p-6 flex flex-col ${merriweather.className}`}>
      <h1>29</h1>
      <p>Concepts learnt</p>
    </div>
  );
};

export default Stat;
