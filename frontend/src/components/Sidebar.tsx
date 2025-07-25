import Link from "next/link";
import { Home, Compass, Bell, Bookmark, Users, Settings } from "lucide-react";

const trending = [
  "#TechTrends",
  "#WebDevelopment",
  "#DigitalArt",
  "#Photography",
  "#Startup",
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-white border-r flex flex-col p-6 space-y-8">
      <div>
        <div className="text-2xl font-extrabold text-purple-600 mb-8">SocialConnect</div>
        <nav className="flex flex-col space-y-2">
          <Link href="/feed" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-50 font-medium text-gray-700"><Home size={20}/> Home</Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-50 font-medium text-gray-700"><Compass size={20}/> Explore</Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-50 font-medium text-gray-700"><Bell size={20}/> Notifications</Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-50 font-medium text-gray-700"><Bookmark size={20}/> Bookmarks</Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-50 font-medium text-gray-700"><Users size={20}/> Communities</Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-50 font-medium text-gray-700"><Settings size={20}/> Settings</Link>
        </nav>
      </div>
      <div>
        <div className="font-bold text-gray-800 mb-2">Trending</div>
        <ul className="space-y-1">
          {trending.map((tag) => (
            <li key={tag} className="text-purple-600 font-medium">{tag}</li>
          ))}
        </ul>
      </div>
      <div className="mt-auto">
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="font-semibold mb-2">Discover new connections</div>
          <div className="text-sm text-gray-500 mb-3">Follow topics and people you're interested in.</div>
          <button className="w-full py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition">Get Started</button>
        </div>
      </div>
    </aside>
  );
} 