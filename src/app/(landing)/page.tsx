
import NewButton from "@/components/ui/NewButton";
import { maxLandingWidth, spacing } from "@/lib/constants";
import { merriweather, ruda } from "../fonts";
export default function Home() {
  return (
    <div className="flex flex-col gap-6 items-center" style={{ paddingTop: spacing.gaps.separateElement }}>
      {/* abstracting sections allows for faster editing */}

      <section style={{ paddingLeft: spacing.padding.normalY, paddingRight: spacing.padding.normalY, maxWidth: maxLandingWidth, rowGap: spacing.gaps.largest - 20 }} className="flex flex-col justify-between items-center sm:w-inherit w-full">
        <article
          style={{ rowGap: spacing.gaps.groupedElement }} className={` flex-1 flex flex-col w-full`}
        >
          <div className="h-full flex flex-col items-center">
            <h1
              id="mainTitle"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
              className={`relative text-center font-extrabold leading-[1.4] z-20`}
            >
              Now THIS is learning.
            </h1>
            <h2 className={`mb-2 max-w-sm text-center`}>
              Learn 10x faster than ever before with linked learning. Only on Dunnoyet.
            </h2>
          </div>
          <div className="grid place-items-center">
            <NewButton className='text-2xl px-[30px] py-[15px] font-bold' buttonVariant='black' actionOrLink="/home">Learn now</NewButton>
          </div>
        </article>
      </section>
      <div className="w-full grid place-items-center bg-primary p-8">
        <img className="max-h-[75vh] object-scale-down" src="Laptop.png" />
      </div>
    </div>
  );
}
