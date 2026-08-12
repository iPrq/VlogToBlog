import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest dark:bg-surface-container-lowest text-on-surface-variant dark:text-on-surface-variant font-label-sm text-label-sm border-t border-outline-variant w-full py-xl flat no shadows flex flex-col md:flex-row justify-between items-center px-gutter max-w-container-max mx-auto mt-auto shrink-0">
      <Link href="/" className="font-headline-md text-headline-md text-on-surface mb-sm md:mb-0 cursor-pointer hover:opacity-90 transition-opacity">
        VtoB
      </Link>
      <div className="mb-sm md:mb-0">
        © 2024 VtoB. Professional Content Repurposing.
      </div>
      <div className="flex gap-md">
        <a className="hover:text-primary transition-colors cursor-pointer" href="#">Privacy Policy</a>
        <a className="hover:text-primary transition-colors cursor-pointer" href="#">Terms of Service</a>
        <a className="hover:text-primary transition-colors cursor-pointer" href="#">API Docs</a>
        <a className="hover:text-primary transition-colors cursor-pointer" href="#">Contact</a>
      </div>
    </footer>
  );
}
