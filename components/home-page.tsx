"use client";

import { AnnouncementBanner } from "@/components/announcement-banner";
import { GradientGenerator } from "@/components/ui/gradient-generator";
import { LineShadowText } from "@/components/ui/line-shadow-text";
import { MorphingText } from "@/components/ui/morphing-text";
import { TextAnimate } from "@/components/ui/text-animate";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

const texts = ["Generates", "Backgrounds", "Patterns", "Colors", "Visuals"];

export default function HomePageClient() {
  const theme = useTheme();
  const shadowColor = theme.resolvedTheme === "dark" ? "white" : "black";

  return (
    <main className="relative" aria-label="Gradient Generator Application">
      <AnnouncementBanner id="jolyui-announcement" variant="rainbow">
        <div className="flex items-center justify-center gap-2 flex-wrap text-white">
          <span className="text-lg">🎉</span>
          <span className="text-sm sm:text-base font-medium">
            JolyUI is live now! I'm excited to share Joly UI, a new component
            library I've built on top of shadcn/ui and Radix UI.
          </span>
          <a
            href="https://github.com/johuniq/jolyui"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm sm:text-base font-semibold underline hover:no-underline transition-all text-white"
          >
            Repo: https://github.com/johuniq/jolyui
          </a>
          <span className="text-lg">🚀</span>
        </div>
      </AnnouncementBanner>
      <div className="lg:pt-48 pt-28 pb-20">
        <section aria-labelledby="hero-heading">
          <Image
            src="https://res.cloudinary.com/deelfmnhg/image/upload/v1737474221/grad_mscerb.png"
            alt="Colorful gradient background"
            height={700}
            width={700}
            className="absolute -top-28 -z-10 min-h-screen w-full object-cover"
            priority
          />

          <h1
            id="hero-heading"
            className="text-5xl leading-none font-semibold tracking-tighter text-balance sm:text-6xl md:text-7xl lg:text-8xl text-center"
          >
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
          <div className="w-full flex items-center justify-center mt-4 ">
            <Link
              href={"https://fazier.com/launches/sweep"}
              aria-label="View Sweep on Fazier"
            >
              <Image
                src="https://fazier.com/api/v1/public/badges/embed_image.svg?launch_id=5885&badge_type=featured&theme=dark"
                alt="Sweep - Create stunning gradients in seconds | Product Hunt"
                style={{ width: "240px", height: "45px" }}
                width="200"
                height="40"
              />
            </Link>
            <Link
              href="https://fazier.com/launches/sweep"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View Sweep launch on Fazier"
            >
              <Image
                src="https://fazier.com/api/v1/public/badges/embed_image.svg?launch_id=5885&badge_type=daily&theme=dark"
                width={240}
                height={45}
                alt="Fazier badge"
                className="w-60 h-[45px]"
              />
            </Link>
          </div>
        </section>

        <section aria-label="Gradient Generator Tool">
          <GradientGenerator />
        </section>
      </div>
    </main>
  );
}
