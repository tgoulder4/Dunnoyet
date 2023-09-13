import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <main className="w-full h-full px-4 lg:px-32 xl:px-48 pt-6 pb-14">
      <div className=" flex flex-col gap-4 h-full">
        <h2 className="font-bold primary text-3xl">The French Revolution</h2>
        <section className="bg-white rounded-3xl h-[90%] w-full text-center flex flex-col items-center justify-between p-10">
          <article className="flex flex-col gap-4 w-full h-[inherit]">
            <h3>'social and political upheaval' - What?</h3>
            <h1 className="text-8xl primary font-bold text-center overflow-y-auto whitespace-normal h-full min-h-0">
              The French revolution in 1789 to 1799 sparked major political and
              social changes.
            </h1>
            {/* 'What is .? I understand -> goes back to enquired sentence which is now amended in terms of this explanation'  */}
          </article>
          <div id="actionArea" className="w-full h-full flex justify-end">
            <Button variant="default" className="w-20 h-10 px-5">
              <img src="./tick_white.png" alt="" />
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
