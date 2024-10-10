'use client'
import Link from "next/link";

export default function Navbar() {
  return (
      <div className="bg-blue-600 h-20 shadow-lg z-50">
        <div className="grid grid-cols-3 h-full items-center">
          <div className="justify-self-start ml-6">
            {/* สามารถเพิ่มไอคอนหรือเมนูที่นี่ */}
          </div>

          <div className="justify-self-center">
            <Link href="/">
              <img className="h-16 w-auto" src="/logotest.png" alt="Logo - Your Brand Name" />
            </Link>
          </div>

          <div className="justify-self-end mr-6 flex items-center space-x-4">
            <Link href="/" className="text-white hover:text-gray-200 transition duration-300">
              Login
            </Link>
            <Link href="/" className="text-white hover:text-gray-200 transition duration-300">
              Register
            </Link>
          </div>
        </div>
      </div>

  );
}
