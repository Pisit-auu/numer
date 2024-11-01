'use client'
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="bg-blue-600 shadow-lg z-50 w-full">
      <div className="flex flex-col md:flex-row justify-between items-center h-24 px-4">
        <div className="ml-6">

        </div>

        <div className="flex justify-center items-center w-full py-2">
          <Link href="/">
            <img
              className="h-32 w-auto max-h-40"  
              src="/numerical.png"
              alt="Logo"
            />
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          
        </div>
      </div>
    </div>
  );
}
