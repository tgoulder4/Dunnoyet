import React from "react";
import Stat from "./Stat";

type Props = {};

const Stats = (props: Props) => {
  return (
    <div className="flex gap-2 divide-x-2 divide-gray-200">
      <Stat type="questions" />
      <Stat type="concepts" />
    </div>
  );
};

export default Stats;
