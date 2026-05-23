'use client'
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/api-doc", label: "API Docs" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="station-nav">
      <Link href="/" className="station-brand" aria-label="Numerical Station home">
        <Image src="/numerical.png" alt="" width={56} height={56} priority />
        <span>NUMERICAL<span>STATION</span></span>
      </Link>
      <nav className="station-nav__links" aria-label="Primary navigation">
        {navLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={pathname === item.href ? "is-active" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="station-nav__status" aria-label="System status">
        <span><i className="status-dot"></i>Online</span>
        <span><i className="status-dot status-dot--amber"></i>Compute Bay</span>
      </div>
    </header>
  );
}
