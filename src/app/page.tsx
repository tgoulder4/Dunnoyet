import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <main className="w-full h-full px-48 pt-6 pb-14">
      <div className=" flex flex-col gap-4 h-full">
        <h2 className="font-bold primary text-3xl">The French Revolution</h2>
        <section className="bg-white rounded-3xl h-full w-full text-center flex flex-col items-center justify-between p-10">
          <article className="flex flex-col">
            <h3>'social and political upheaval' - What?</h3>
            <h1 className="text-8xl primary font-bold text-center">
              Some title text
            </h1>
            {/* 'What is .? I understand -> goes back to enquired sentence which is now amended in terms of this explanation'  */}
          </article>
          <div id="actionArea">
            <Button variant="outline">Some action</Button>
          </div>
        </section>
      </div>
    </main>
  );
}
