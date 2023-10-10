"use client";
import { merriweather } from "../../../../fonts";
import Thread from "@/components/Thread";
import { useState } from "react";
export default function Home() {
  const [title, setTitle] = useState("New Question");
  return (
    <main
      className={`text-complementary max-w-3xl mx-auto flex flex-col gap-4 h-full w-full px-4 pt-6 pb-14`}
    >
      <h2 className={`font-black text-[2rem] ${merriweather.className}`}>
        {title}
      </h2>
      <div className="flex flex-col gap-3 pb-16">
        <Thread setTitle={setTitle} />
      </div>
    </main>
  );
}
