import Link from "next/link";
import { merriweather, ruda } from "@/app/fonts";
import { Button } from "@/components/Navbar/button";
export default function Home() {
  return (
    <main className="flex flex-col gap-6 items-center w-5/6 mx-auto py-8 max-w-4xl">
      <section className="flex flex-col sm:flex-row justify-between  items-center h-80 gap-5 sm:w-inherit w-full">
        <article
          className={`${merriweather.className} flex-1 flex flex-col gap-2 max-w-sm `}
        >
          <div className="h-full">
            <h1
              id="mainTitle"
              className={`${merriweather.className} relative font-black text-5xl leading-[1.4] z-20`}
            >
              Seriously in-depth learning
              <div
                id="block"
                className="bg-complementary_lightest w-56 h-6 absolute top-[44px] left-0 z-[-1]"
              ></div>
            </h1>
          </div>
          <h2 className={`mb-2 ${ruda.className}`}>
            Turn any educative material into content tailored to your individual
            understanding.
          </h2>
          <div className="flex gap-2">
            <Link href="/home">
              <Button
                variant={"default"}
                className={`${merriweather.className}`}
              >
                Try One Question Free
              </Button>
            </Link>
            <Button
              variant={"secondary"}
              className={`${merriweather.className}`}
            >
              How It Works
            </Button>
          </div>
        </article>
        <div className="">
          <div className="px-10">
            <div className="overflow-hidden relative mx-auto border-zinc-800 dark:border-zinc-800 bg-zinc-800 border-[8px] rounded-t-xl h-[172px] max-w-[301px] md:h-[260px] md:max-w-[512px]">
              <div className="rounded-lg overflow-hidden h-[156px] md:h-[280px] bg-white dark:bg-zinc-800">
                <img
                  src="/MODEL.png"
                  className="object-fill select-none hidden dark:block h-[156px] md:h-[278px] w-full rounded-lg"
                  alt=""
                />
              </div>
            </div>
          </div>

          <div className="relative mx-auto bg-zinc-900 dark:bg-zinc-700 rounded-b-xl rounded-t-sm h-[17px] max-w-[351px] md:h-[21px] md:max-w-[597px]">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl w-[56px] h-[5px] md:w-[96px] md:h-[8px] bg-zinc-800"></div>
          </div>
        </div>
        {/* <div className="relative h-64 flex-2 border-8 border-complementary rounded-lg sm:w-[380px] w-full outline-red-500 outline-dashed outline-2 ">
          <Image
            src="/MODEL.png" // do a fetch of a relavent image
            className="w-fit"
            objectFit="contain"
            layout="fill"
            alt=""
          />
        </div> */}
      </section>
      <section className="flex flex-col justify-center items-center p-8 gap-5 sm:w-inherit w-full bg-[#f3f3f3] rounded-xl">
        <article
          className={`${merriweather.className} flex-1 items-center flex flex-col gap-2 `}
        >
          <div className="">
            <h1
              id="mainTitle"
              className={`${merriweather.className} text-center relative font-black text-5xl leading-[1.4] z-20`}
            >
              One size doesn't fit all.
            </h1>
          </div>
          <h2 className={`${ruda.className} text-center max-w-md mb-2`}>
            dunnoyet transforms content into bite-sized information that
            connects to your pre-existing knowledge.
          </h2>
          <div className="flex gap-2 items-end max-w-md">
            <div
              id="block"
              className="w-full bg-[#dedede] rounded-md p-8 pb-10 "
            >
              <h2 className={`${ruda.className} font-bold text-lg`}>
                All Other AI Learning Resources
              </h2>
              <ul>
                <li>• 50% of generated information is incorrect</li>
                <li>• Long, complex answers</li>
                <li>• No tailored information</li>
              </ul>
            </div>
            <div
              id="block"
              className="flex flex-col gap-4 items-center w-full bg-primary p-8 rounded-md"
            >
              <img className="w-3/5" src="/logo_light.png" alt="dunnoyet" />
              <ul id="dunnoyetReasonsToChoose">
                <li>
                  • 100% factual content<Link href="/">*</Link>
                </li>
                <li>• Clear answers</li>
                <li>• New information is tailored to your current knowledge</li>
              </ul>
              <Link href="/home">
                <Button variant="grey" className="text-white">
                  Learn Something New
                </Button>
              </Link>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
