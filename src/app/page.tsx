import { merriweather } from "./layout";
import Image from "next/image";
import GPTResponse from "@/components/gpt/response";
export default function Home() {
  const subject = "The French Revolution";
  return (
    <main
      className={`text-complementary flex flex-col gap-4 h-full w-full px-4 lg:px-32 xl:px-48 pt-6 pb-14`}
    >
      <h2 className={`font-black text-[2rem] ${merriweather.className}`}>
        {subject}
      </h2>
      <div className="flex flex-col gap-3">
        <GPTResponse></GPTResponse>
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
