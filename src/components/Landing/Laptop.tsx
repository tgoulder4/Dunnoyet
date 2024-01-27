import React from 'react'

function Laptop() {
    return (
        <div className="">
            <div className="px-10">
                <div className="overflow-hidden relative mx-auto border-zinc-800 dark:border-zinc-800 bg-zinc-800 border-[8px] rounded-t-xl h-[172px] md:h-[260px] w-full">
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
    )
}

export default Laptop