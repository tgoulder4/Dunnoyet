import { merriweather } from "./layout";
import Image from "next/image";
import Conversation from "@/components/GPT/Cards/response";
import UserQuestionInput from "@/components/user/inputQuestion";
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
        <UserQuestionInput open={false} />

        <Conversation />
        <div className="relative h-[300px]">
          <Image
            src="/frenchRevolution.png" // do a fetch of a relavent image
            className="rounded-[30px]"
            layout="fill"
            objectFit="cover"
            alt=""
          />
        </div>
      </div>
    </main>
  );
}
