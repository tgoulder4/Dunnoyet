import { Button } from "@/components/ui/button";
import Image from "next/image";
import Carousel from "@/components/carousel";

export default function Home() {
  return (
    <main className="w-full h-full px-4 lg:px-32 xl:px-48 pt-6 pb-14">
      <div className=" flex flex-col gap-4 h-full">
        <Carousel />
      </div>
    </main>
  );
}
