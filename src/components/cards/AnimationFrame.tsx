import React, { useRef, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
function Animation() {
  // The spring animation to move the electrons away when they're close
  const { x } = useSpring({
    from: { x: 0 },
    to: { x: 1 },
    config: { tension: 200, friction: 5 },
  });

  return (
    <div className="bg-complementary w-full h-25 rounded-lg">
      {/* your animation here */}
      {/* Left Electron */}
      <animated.div
        style={{
          position: "absolute",
          left: "20%",
          top: "50%",
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          backgroundColor: "blue",
          transform: x
            .interpolate([0, 0.5, 1], [0, -30, 0])
            .interpolate((x) => `translateX(${x}px)`),
        }}
      >
        -
      </animated.div>

      {/* Right Electron */}
      <animated.div
        style={{
          position: "absolute",
          right: "20%",
          top: "50%",
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          backgroundColor: "blue",
          transform: x
            .interpolate([0, 0.5, 1], [0, 30, 0])
            .interpolate((x) => `translateX(${x}px)`),
        }}
      >
        -
      </animated.div>
    </div>
  );
}

export default Animation;
