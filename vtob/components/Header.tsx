import React from "react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="font-headline-md text-headline-md font-body-md text-body-md border-outline-variant dark:border-outline-variant flat no shadows flex justify-between items-center h-16 w-full px-gutter max-w-container-max mx-auto z-50 bg-transparent shrink-0">
      <Link href="/" className="flex items-center gap-sm cursor-pointer hover:opacity-90 transition-opacity">
        <img 
          alt="VtoB Logo" 
          className="h-8 w-8 object-contain" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwmTqspJPIxxF1_OKJEllKw8VXHTYmHflKG7_GmS7kTVpztdKPR6cI2JSjuvpOscTXbXJlv7Eqi8Ht16qfSMvveI4pcSM0mllKsRbA3h3nqPNh4lFqYbPhR-U1CtuA02vLs83qCPEC9qaSBCBnvTZLR6j8ms3-4YwW1ywKAB-Hp8fWbYK5MFFnTahToCPcnTsQy25jcozoXN4s_lZWLOFvCE_ov2hzK7eOxH9rn6m28YMCIyMmTCw-wQ"
        />
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
