"use client";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import * as React from "react";
import { type HTMLAttributes, useEffect, useState } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

type BannerVariant = "rainbow" | "normal";

export function AnnouncementBanner({
  id,
  xColor,
  variant = "normal",
  changeLayout = true,
  height = "3rem",
  rainbowColors = [
    "rgba(0,149,255,0.56)",
    "rgba(231,77,255,0.77)",
    "rgba(255,0,0,0.73)",
    "rgba(131,255,166,0.66)",
  ],
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  /**
   * @defaultValue 3rem
   */
  height?: string;

  xColor?: string;

  /**
   * @defaultValue 'normal'
   */
  variant?: BannerVariant;

  /**
   * For rainbow variant only, customise the colors
   */
  rainbowColors?: string[];

  /**
   * Change Fumadocs layout styles
   *
   * @defaultValue true
   */
  changeLayout?: boolean;
}) {
  const [open, setOpen] = useState(true);
  const globalKey = id ? `nd-banner-${id}` : null;

  useEffect(() => {
    if (globalKey) {
      // Defer setOpen to avoid synchronous state update in effect
      setTimeout(() => {
        setOpen(localStorage.getItem(globalKey) !== "true");
      }, 0);
    }
  }, [globalKey]);

  if (!open) return null;

  return (
    <div
      id={id}
      {...props}
      className={cn(
        "sticky top-0 z-40 flex flex-row items-center justify-center px-4 py-2 text-center text-sm font-medium",
        variant === "normal" && "bg-fd-secondary",
        variant === "rainbow" && "bg-fd-background",
        !open && "hidden",
        props.className
      )}
      style={{
        minHeight: height,
      }}
    >
      {changeLayout && open ? (
        <style>
          {globalKey
            ? `:root:not(.${globalKey}) { --fd-banner-height: ${height}; }`
            : `:root { --fd-banner-height: ${height}; }`}
        </style>
      ) : null}
      {globalKey ? (
        <style>{`.${globalKey} #${id} { display: none; }`}</style>
      ) : null}
      {globalKey ? (
        <script
          dangerouslySetInnerHTML={{
            __html: `if (localStorage.getItem('${globalKey}') === 'true') document.documentElement.classList.add('${globalKey}');`,
          }}
        />
      ) : null}

      {variant === "rainbow"
        ? flow({
            colors: rainbowColors,
          })
        : null}
      {props.children}
      {id ? (
        <button
          type="button"
          aria-label="Close Banner"
          onClick={() => {
            setOpen(false);
            if (globalKey) {
              localStorage.setItem(globalKey, "true");
              window.dispatchEvent(new Event("banner-status-changed"));
            }
          }}
          className={cn(
            buttonVariants({
              variant: "ghost",
              className: cn(
                "absolute cursor-pointer end-4 top-1/2 -translate-y-1/2 transition-colors",
                variant === "rainbow"
                  ? "text-white/80 hover:text-white"
                  : "text-muted-foreground hover:text-foreground"
              ),
              size: "icon",
            })
          )}
        >
          <X color={xColor} />
        </button>
      ) : null}
    </div>
  );
}

function flow({ colors }: { colors: string[] }) {
  return (
    <>
      <div
        className="absolute inset-0 z-[-1]"
        style={
          {
            backgroundImage: `linear-gradient(90deg, ${colors.join(", ")}, ${
              colors[0]
            })`,
            backgroundSize: "200% 100%",
            animation: "fd-moving-banner 10s linear infinite",
            filter: "blur(10px)",
            opacity: 0.8,
          } as object
        }
      />
      <div className="absolute inset-0 z-[-1] backdrop-blur-[2px]" />
      <style>
        {`@keyframes fd-moving-banner {
            from { background-position: 0% 0;  }
            to { background-position: 100% 0;  }
         }`}
      </style>
    </>
  );
}
