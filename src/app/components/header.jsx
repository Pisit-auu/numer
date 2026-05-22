'use client'
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="station-nav">
      <Link href="/" className="station-brand" aria-label="Numerical Station home">
        <Image src="/numerical.png" alt="" width={56} height={56} priority />
        <span>NUMERICAL<span>STATION</span></span>
      </Link>
      <div className="station-nav__status">
        <span><i className="status-dot"></i>Online</span>
        <span><i className="status-dot status-dot--amber"></i>Compute Bay</span>
      </div>
    </header>
  );
}
