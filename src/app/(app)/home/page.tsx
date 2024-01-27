import { merriweather } from "@/app/fonts";
import Conversation from "./components/Conversation";
import Stats from "./components/Stats";
import { getThreadsByUserId } from "@/app/(api)/Actions/actions"
type Props = {};
export default function Home({ }: Props) {
  const threads = getThreadsByUserId(getCurrentUserID());
  return (
    <main
      className={`text-complementary max-w-3xl mx-auto flex flex-col gap-4 h-full w-full px-4 pt-6 pb-14`}
    >
      <h2 className={`text-[2rem] ${merriweather.className}`}>
        Welcome back, Tye!
      </h2>
      <Stats />
      <h2 className={` text-[2rem] ${merriweather.className}`}>Past lessons</h2>
      <div className="flex flex-col gap-3 pb-16">
        <div className="flex flex-col gap-3">
          {threads.map((thread) => (
            <Conversation
              question={thread.messages[0].content}
              key={thread.id}
              subject={thread.subject}
              lastUsed={thread.lastUsed}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
