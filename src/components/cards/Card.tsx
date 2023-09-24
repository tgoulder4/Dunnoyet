import * as React from "react";
function Card({ otherClassNames, ...props }: { otherClassNames?: string }) {
  return (
    <div
      className={`relative w-full p-8 rounded-t-[30px] flex ${otherClassNames}`}
      {...props}
    >
      {props.children}
    </div>
  );
}

export default Card;
