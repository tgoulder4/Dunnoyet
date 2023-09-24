import { merriweather } from "./layout";
import Image from "next/image";
import Thread from "@/components/GPT/Cards/response";
import UserQuestionInput from "@/components/user/inputQuestion";
import AdditionalInputRequested from "@/components/user/additionalInputRequested";
export default function Home() {
  const subject = "The French Revolution";
  return (
    <main
      className={`text-complementary max-w-2xl mx-auto flex flex-col gap-4 h-full w-full px-4 pt-6 pb-14`}
    >
      <h2 className={`font-black text-[2rem] ${merriweather.className}`}>
        {subject}
      </h2>
      <div className="flex flex-col gap-3">
        <UserQuestionInput />
        <AdditionalInputRequested />
        <Thread />
      </div>
    </main>
  );
}
