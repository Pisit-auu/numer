'use client'
import Link from "next/link";

export default function Navbar() {
  return (
<div className="bg-blue-600 shadow-lg z-50 w-full">
  <div className="flex flex-col md:flex-row justify-between items-center h-24 px-4">
    <div className="ml-6">
      {/* ถ้ามีเนื้อหาเพิ่มเติม */}
    </div>

    <div className="flex justify-center py-2">
      <Link href="/">
        <img className="h-16 w-auto" src="/logotest.png" alt="Logo - Your Brand Name" />
      </Link>

      <div className="flex items-center space-x-4">
        <Link href="/" className="text-white hover:text-gray-200 transition duration-300">
          Login
        </Link>
        <Link href="/" className="text-white hover:text-gray-200 transition duration-300">
          Register
        </Link>
      </div>
    </div>
  </div>
</div>


  );
}
