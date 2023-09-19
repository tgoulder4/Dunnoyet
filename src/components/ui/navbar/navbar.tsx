import Link from "next/link";
import { Button } from "./button";
import {montserrat} from "../../../app/layout"
interface navItem {
  logoPath?: string;
  alt?: string;
  divider?: boolean;
  text?: string;
  url: string;
}
interface NavbarProps {
  brandSide: Array<navItem>;
  middle: Array<navItem>;
  userSide: Array<navItem>;
  alignment: "between" | "center";
}
function Navbar({ brandSide, middle, userSide, alignment }: NavbarProps) {
  return (
    <>
      <header
        className={`bg-primary h-14 flex items-center justify-${alignment} p-3 px-16 ${montserrat.className}`}
      >
        <div id="brandSide" className="flex items-center gap-4 h-full">
          {brandSide.map((item) => {
            return (
              <>
                <Button asChild variant="link" className="h-full ">
                  <Link href={item.url} className="font-[600]">
                    {item.text ? (
                      item.text
                    ) : (
                      <img
                        src={item.logoPath}
                        className="h-full object-scale-down"
                        alt={item.alt}
                      />
                    )}
                  </Link>
                </Button>
                {item.divider ? (
                  <div className="w-[2px] h-full bg-[rgb(0_0_0_/_25%)]"></div>
                ) : (
                  <></>
                )}
              </>
            );
          })}
        </div>
        <div id="middle" className="flex items-center gap-4 h-full">
          {middle.map((item) => {
            return (
              <>
                <Button asChild variant="link" className="h-full">
                  <Link href={item.url} className="font-[600]">
                    {item.text ? (
                      item.text
                    ) : (
                      <img
                        src={item.logoPath}
                        className="h-full object-scale-down"
                        alt={item.alt}
                      />
                    )}
                  </Link>
                </Button>
                {item.divider ? (
                  <div className="w-[2px] h-full bg-[rgb(0_0_0_/_25%)]"></div>
                ) : (
                  <></>
                )}
              </>
            );
          })}
        </div>
        <div id="userSide" className="flex gap-2 items-center">
          {userSide.map((item) => {
            return (
              <>
                <Button asChild variant="outline" className="h-full ">
                  <Link href={item.url} className="font-[600]">
                    {item.text ? (
                      item.text
                    ) : (
                      <img
                        src={item.logoPath}
                        className="h-full object-scale-down"
                        alt={item.alt}
                      />
                    )}
                  </Link>
                </Button>
                {item.divider ? (
                  <div className="w-[2px] h-full bg-[rgb(0_0_0_/_25%)]"></div>
                ) : (
                  <></>
                )}
              </>
            );
          })}
          {/* after learning about authentication, put the login component here */}
        </div>
      </header>
    </>
  );
}

export default Navbar;
