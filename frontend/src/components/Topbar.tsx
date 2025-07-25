import Link from "next/link";
import { Home, Compass, Send, Bell, User } from "lucide-react";

export default function Topbar() {
  return (
    <nav className="w-full bg-white border-b flex items-center justify-between px-8 py-2 sticky top-0 z-50">
      {/* Logo */}
      <Link href="/feed" className="text-2xl font-extrabold text-gray-900 tracking-tight">SocialConnect</Link>
      {/* Search */}
      <div className="flex-1 flex justify-center">
        <input
          type="text"
          placeholder="Search"
          className="w-80 px-4 py-1 rounded-full border bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
      </div>
      {/* Icons */}
      <div className="flex items-center gap-6">
        <Link href="/feed"><Home size={24} className="hover:text-purple-600" /></Link>
        <Link href="#"><Compass size={24} className="hover:text-purple-600" /></Link>
        <Link href="/messages"><Send size={24} className="hover:text-purple-600" /></Link>
        <Link href="#"><Bell size={24} className="hover:text-purple-600" /></Link>
        <Link href="/profile"><User size={24} className="hover:text-purple-600" /></Link>
      </div>
    </nav>
  );
} 