import React from "react";
import Stat from "./Stat";

type Props = {};

const Stats = (props: Props) => {
  return (
    <div className="flex p-4 divide-x-2 bg-white divide-gray-50 rounded-lg">
      <Stat type="questions" />
      <Stat type="concepts" />
    </div>
  );
};

export default Stats;
