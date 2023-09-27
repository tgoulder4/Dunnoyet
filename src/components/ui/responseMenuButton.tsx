import { Button } from "./button";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
function ResponseMenuButton() {
  const [clicked, setClicked] = useState(false);
  return (
    <>
      <div className="relative">
        <MoreHorizontal
          color="#000000"
          onClick={() => {
            setClicked(!clicked);
          }}
        />
        {clicked ? (
          <div className="absolute flex justify-center z-50 -top-10 w-48">
            <Button className="absolute z-50 -top-10">View Source(s)</Button>
          </div>
        ) : (
          <></>
        )}{" "}
      </div>
    </>
  );
}

export default ResponseMenuButton;
