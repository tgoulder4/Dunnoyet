import MainTitleArea from "@/components/Landing/MainTitleArea";
import { spacing } from "@/lib/constants";
export default function Home() {
  return (
    <main className="flex flex-col gap-6 items-center mx-auto pb-8" style={{ paddingTop: spacing.gaps.separateElement }}>
      {/* abstracting sections allows for faster editing */}
      <MainTitleArea />
    </main>
  );
}
