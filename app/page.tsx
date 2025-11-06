"use client";
import { GradientGenerator } from "@/components/ui/gradient-generator";
import { LineShadowText } from "@/components/ui/line-shadow-text";
import { MorphingText } from "@/components/ui/morphing-text";
import { TextAnimate } from "@/components/ui/text-animate";
import { useTheme } from "next-themes";
import Image from "next/image";

const texts = ["Generates", "Backgrounds", "Patterns", "Colors", "Visuals"];

export default function Home() {
  const theme = useTheme();
  const shadowColor = theme.resolvedTheme === "dark" ? "white" : "black";
  return (
    <div className="relative">
      <div className="pt-52 pb-20">
        <div className="">
          <Image
            src="https://res.cloudinary.com/deelfmnhg/image/upload/v1737474221/grad_mscerb.png"
            alt="hero_bg_sweep.png"
            height={700}
            width={700}
            className="absolute -top-28 -z-10 min-h-screen w-full object-cover"
          />

          <h1 className="text-5xl leading-none font-semibold tracking-tighter text-balance sm:text-6xl md:text-7xl lg:text-8xl text-center">
            <LineShadowText className="italic" shadowColor={shadowColor}>
              SWEEP
            </LineShadowText>
          </h1>
          <MorphingText texts={texts} />
          <TextAnimate
            animation="blurInUp"
            by="character"
            once
            className="w-full mx-auto text-center max-w-lg mt-4 text-wrap"
          >
            Where colors breathe, blend, and become art. Craft mesmerizing
            gradients that speak to the soul.
          </TextAnimate>
        </div>
        <GradientGenerator />
      </div>
    </div>
  );
}

export { Home };
