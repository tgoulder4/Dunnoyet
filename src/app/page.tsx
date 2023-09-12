import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <main className="w-full h-full grid place-items-center">
      <div className="h-5/6 w-3/4">
        <h2>Title</h2>
        <section className="bg-white h-full rounded-3xl flex flex-col items-center justify-between p-10">
          <article>
            <h3>What was said</h3>
            <h1>Some title text</h1>
          </article>
          <div id="actionArea">
            <Button variant="outline">Some action</Button>
          </div>
        </section>
      </div>
    </main>
  );
}
