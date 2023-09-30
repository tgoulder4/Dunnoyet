import Link from "next/link";
import { Button } from "./button";
import { ruda, merriweather } from "../../../app/fonts";
interface navItem {
  content: {
    variant:
      | "link"
      | "ghost"
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | null
      | undefined;
    text?: {
      text: string;
      color: string;
    };
    alt: string;
    logoPath?: string;
    url: string;
  };
  rightDivider?: boolean;
}
interface NavbarProps {
  brandSide: Array<navItem>;
  middle: Array<navItem>;
  userSide: Array<navItem>;
  alignment: "between" | "center";
  color?: string;
}
function Navbar({
  brandSide,
  middle,
  userSide,
  alignment,
  color = "bg-primary-header",
}: NavbarProps) {
  function getNavItems(items: Array<navItem>) {
    return items.map((item) => (
      <>
        <Button asChild variant={item.content.variant} className="h-full">
          <Link
            href={item.content.url}
            className={`${
              item.content.text ? "text-" + item.content.text.color : ""
            } font-[600] `}
          >
            {item.content.text ? (
              item.content.text.text
            ) : (
              <img
                src={item.content.logoPath}
                className="h-full object-scale-down"
                alt={item.content.alt}
              />
            )}
          </Link>
        </Button>
        {item.rightDivider ? (
          <div className="w-[2px] h-full bg-[rgb(0_0_0_/_25%)]"></div>
        ) : (
          <></>
        )}
      </>
    ));
  }
  return (
    <>
      <header
        className={`drop-shadow-md ${color} h-14 flex items-center justify-${alignment} p-3 px-16 ${ruda.className} sticky top-0 z-50`}
      >
        <div
          id="brandSide"
          className={`${merriweather.className} flex items-center gap-4 h-full`}
        >
          {getNavItems(brandSide)}
        </div>
        <div id="middle" className="flex items-center gap-4 h-full">
          {getNavItems(middle)}
        </div>
        <div id="userSide" className="flex gap-2 h-full items-center">
          {getNavItems(userSide)}
          {/* after learning about authentication, put the login component here */}
        </div>
      </header>
    </>
  );
}

export default Navbar;
