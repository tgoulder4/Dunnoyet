import { getUserThreadByQuestion } from "@/app/(api)/Actions/actions";
import { merriweather } from "@/app/fonts";
import Thread from "@/components/Thread";
import { useEffect, useState } from "react";
import { IThread } from "@/app/(api)/types";
var equal = require("deep-equal")
type Props = {};
export default function Home({ }: Props) {
  //find the ithread thread that matches the threadQuestion in the url. getThreadByQuestion(user - from cookies -,threadQuestion)
  const [thread, setThread] = useState({} as IThread);
  useEffect(() => {
    async function main() {
      const thread: IThread | null = await getUserThreadByQuestion("1F2B3C4D5E6F7G8H9I0J", "Who were the Bourbon Monarch?");
      if (thread === null) {
        console.error("thread is null")
        return
      } else {
        setThread(thread);
      }

    }
    main();
  }, []);

  return (
    <main
      className={`text-complementary max-w-3xl mx-auto flex flex-col gap-4 h-full w-full px-4 pt-6 pb-14`}
    >
      <h2 className={`font-black text-[2rem] ${merriweather.className}`}>
        {thread.subject}
      </h2>
      <div className="flex flex-col gap-3 pb-16">
        <Thread _messages={thread.messages} />
      </div>
    </main>
  );
}
