import { merriweather } from "@/app/fonts";
import Thread from "@/components/Thread";
type Props = {};
export default function Home({}: Props) {
  return (
    <main
      className={`text-complementary max-w-3xl mx-auto flex flex-col gap-4 h-full w-full px-4 pt-6 pb-14`}
    >
      <h2 className={`font-black text-[2rem] ${merriweather.className}`}>
        The Bourbon Monarch
      </h2>
      <div className="flex flex-col gap-3 pb-16">
        <Thread />
      </div>
    </main>
  );
}
