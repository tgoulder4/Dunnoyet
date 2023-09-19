import { merriweather } from "./layout";
import GPTResponse from "@/components/gpt/response";
export default function Home() {
  const subject = "The French Revolution";
  return (
    <main className={` flex flex-col gap-4 h-full w-full px-4 lg:px-32 xl:px-48 pt-6 pb-14`}>
        <h2 className={`font-black text-4xl text-primary_gray ${merriweather.className}`}>
          {subject}
        </h2>
        <div className="flex flex-col gap-3">
          <GPTResponse></GPTResponse>
        </div>
    </main>
  );
}
