import { useState, useEffect } from "react";
import logoUrl from "@/app/assets/images/sudologo.svg?url";

export default function SudoLogo({
  className = "",
  size = 64,
  spin = true,
  ...props
}) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!spin) {
      setRotation(0);
      return;
    }

    let animationFrameId;

    const animate = () => {
      setRotation((prevRotation) => (prevRotation + 1) % 360);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [spin]);

  return (
    <div
      className={`flex justify-center ${className}`.trim()}
      {...props}
    >
      <div
        className="transition-all duration-300 "
        style={{
          width: size,
          height: size,
        }}
      >
        <div
          className="relative w-full h-full overflow-hidden"
          style={{
            maskImage: `url(${logoUrl.src})`,
            maskSize: 'contain',
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskImage: `url(${logoUrl.src})`,
            WebkitMaskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            transform: `rotate(${rotation}deg)`,
          }}
        >
          <div
            className="absolute w-[150%] h-[150%] left-[-25%] top-[-25%] bg-gradient-to-br from-[#ab6fe4] to-[#fb7992]"
            style={{
              transform: `rotate(${-rotation}deg)`,
            }}
          />
        </div>
      </div>
    </div>
  );
} 