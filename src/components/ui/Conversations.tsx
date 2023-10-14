"use client";
import React from "react";
import { useState } from "react";
import Conversation from "./Conversation";
type Props = {};

const Conversations = (props: Props) => {
  const [conversations, setConversations] = useState([
    {
      question: "What was the French Revolution",
      subject: "The French Revolution",
      date: "Just now",
    },
    {
      question: "What is the normal contact force?",
      subject: "The Normal Contact Force",
      date: "Just now",
    },
  ]);
  return (
    <div className="flex flex-col gap-3">
      {conversations.map((convo, index) => (
        <Conversation
          question={convo.question}
          key={index}
          subject={convo.subject}
          date={convo.date}
        />
      ))}
    </div>
  );
};

export default Conversations;
