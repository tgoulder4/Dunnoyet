import React, { useState } from "react";

type Props = {
  question: string;
  subject: string;
  date: string;
};

const Conversation = ({ question, subject, date }: Props) => {
  const [selected, setSelected] = useState(false);
  return (
    <div
      className={`bg-[#ECEEFF] ${
        selected ? "outline-4" : "outline-2"
      } outline-[#888FCE] outline w-full px-2 py-4 rounded-lg flex justify-between`}
    >
      {question}
    </div>
  );
};

export default Conversation;
