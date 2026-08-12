import React from "react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="font-headline-md text-headline-md font-body-md text-body-md border-outline-variant dark:border-outline-variant flat no shadows flex justify-between items-center h-16 w-full px-gutter max-w-container-max mx-auto z-50 bg-transparent shrink-0">
      <Link href="/" className="cursor-pointer hover:opacity-90 transition-opacity">
        <span className="text-headline-md font-headline-md font-bold text-on-surface">VtoB</span>
      </Link>
      <div>
        <button className="font-label-sm text-label-sm border border-outline-variant text-on-surface hover:text-primary hover:border-primary transition-colors duration-200 px-md py-xs rounded-3xl cursor-pointer">
          Sign In
        </button>
      </div>
    </header>
  );
}
