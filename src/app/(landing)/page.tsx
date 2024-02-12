import MainTitleArea from "@/components/Landing/MainTitleArea";
export default function Home() {
  return (
    <main className="flex flex-col gap-6 items-center mx-auto py-8">
      {/* abstracting sections allows for faster editing */}
      <MainTitleArea />
    </main>
  );
}
