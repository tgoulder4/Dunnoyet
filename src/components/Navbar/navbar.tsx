import Link from "next/link";
import { Button } from "./button";
import { ruda, merriweather } from "../../app/fonts";
import UserAuthButton from "./UserAuthButton";
import { sizing } from "@/lib/constants";
interface navItem {
  jsx?: React.ReactNode,
  content: {
    variant:
    | "link"
    | "ghost"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "white"
    | null
    | undefined;
    text?: {
      text: string;
      color: string;
    };
    backgroundColour?: string;
    tooltip?: string;
    padding?: string;
    alt: string;
    logoPath?: string;
    url: string;
    jsx?: React.ReactNode;
    type?: "userProfileArea";
  };
  tooltip?: string;
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
      <>{
        item.jsx ? item.jsx : <Button
          asChild
          variant={item.content.variant}
          style={{ fontSize: sizing.globalFontSize }}
          key={item.content.alt}
          className={`h-full ${item.content.padding}`}
          tooltip={item.content.tooltip ? item.content.tooltip : "false"}
        >
          <Link
            href={item.content.url}

            className={`${item.content.text ? "text-" + item.content.text.color : ""
              } font-[600] `}
          >
            {item.content.jsx ? (
              <>{item.content.jsx}</>
            ) : item.content.text ? (
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
      }
        {item.rightDivider ? (
          <div className="flex-1 w-[2px] h-full bg-[rgb(0_0_0_/_25%)]"></div>
        ) : (
          <></>
        )}
      </>
    ));
  }
  return (
    <>
      <header
        className={`drop-shadow-md ${color} h-16  flex items-center justify-${alignment} py-3 px-16 sticky top-0 z-50`}
      >
        <div
          id="brandSide"
          className={`flex items-center gap-4 h-full`}
        >
          {getNavItems(brandSide)}
        </div>
        <div id="middle" className="flex items-center gap-4 h-full">
          {getNavItems(middle)}
        </div>
        <div id="userSide" className="flex gap-4 h-full items-center">
          {getNavItems(userSide)}
          {/*UserAuthbutton*/}
          <UserAuthButton />
          {/* after learning about authentication, put the login component here */}
        </div>
      </header>
    </>
  );
}

export default Navbar;
