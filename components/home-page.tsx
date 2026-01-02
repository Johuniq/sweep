"use client";

import { ArrowRight } from "lucide-react";

import { AnnouncementBanner } from "@/components/announcement-banner";
import { Button } from "@/components/ui/button";
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
        <div className="flex items-center justify-center gap-3 text-white">
          <span className="font-medium hidden sm:inline">
            🎉 Introducing JolyUI: A modern component library built on shadcn/ui.
          </span>
          <span className="font-medium sm:hidden">
            🎉 JolyUI is live!
          </span>
          <Link
            href="https://github.com/johuniq/jolyui"
            target="_blank"
            className="inline-flex items-center gap-1 rounded-full bg-black/20 px-3 py-1 text-sm font-medium text-white hover:bg-black/40 transition-colors backdrop-blur-sm"
          >
            Star on GitHub <ArrowRight className="h-4 w-4" />
          </Link>
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
          <div className="w-full flex items-center justify-center mt-8">
            <Link
              href="https://github.com/johuniq/jolyui"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                className="rounded-full text-base h-12 px-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                Explore JolyUI <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
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
