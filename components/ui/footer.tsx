import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

function Footer() {
  return (
    <footer className="bg-background py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center">
          <Link
            href="/"
            aria-label="home"
            className="flex gap-2 items-center pb-5"
          >
            <p className="font-semibold text-xl tracking-tighter"> sweep</p>
          </Link>{" "}
          <div className="mb-8 flex space-x-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full flex items-center justify-center"
            >
              <Facebook className="h-4 w-4" />
              <Link href="https://www.facebook.com/johuniq">
                <span className="sr-only">Facebook</span>
              </Link>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Twitter className="h-4 w-4" />
              <Link href="https://x.com/johuniq">
                <span className="sr-only">Twitter</span>
              </Link>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Instagram className="h-4 w-4" />
              <Link href="https://www.instagram.com/johuniq">
                <span className="sr-only">Instagram</span>
              </Link>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Linkedin className="h-4 w-4" />
              <Link href="https://www.linkedin.com/in/johuniq">
                <span className="sr-only">LinkedIn</span>
              </Link>
            </Button>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()}{" "}
              <Link
                href="https://johusoft.tech"
                className="hover:text-blue-600"
              >
                Johuniq
              </Link>{" "}
              All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
