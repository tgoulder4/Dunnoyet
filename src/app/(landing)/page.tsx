import Link from "next/link";
import { merriweather, ruda } from "@/app/fonts";
import { Button } from "@/components/Navbar/button";
import { colours } from "../constants";
import Laptop from "@/components/Landing/Laptop";
import MainTitleArea from "@/components/Landing/MainTitleArea";
export default function Home() {
  return (
    <main className="flex flex-col gap-6 items-center w-5/6 mx-auto py-8 max-w-4xl">
      <MainTitleArea />
    </main>
  );
}
