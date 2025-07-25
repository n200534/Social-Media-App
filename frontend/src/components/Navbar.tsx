import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow flex items-center justify-between px-6 py-3">
      <div className="flex items-center space-x-6">
        <Link href="/feed" className="font-bold text-lg">SocialApp</Link>
        <Link href="/feed" className="hover:underline">Feed</Link>
        <Link href="/profile" className="hover:underline">Profile</Link>
        <Link href="/messages" className="hover:underline">Messages</Link>
      </div>
      <div>
        <Link href="/auth" className="bg-black text-white px-4 py-1 rounded">Login/Register</Link>
      </div>
    </nav>
  );
} 