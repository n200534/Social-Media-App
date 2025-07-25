"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { UserPlus, Settings } from "lucide-react";

interface Post {
  id: number;
  content: string;
  image_url?: string;
  created_at: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      apiFetch<Post[]>(`/posts/me`, {}, true)
        .then(setPosts)
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <div className="w-full max-w-xl mx-auto py-8">
      {/* Profile info */}
      <div className="flex items-center gap-8 mb-8">
        <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-3xl font-bold text-purple-700">
          {user?.username?.[0]?.toUpperCase() || "U"}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-2xl font-bold">{user?.username}</span>
            <button className="px-4 py-1 bg-purple-600 text-white rounded font-semibold flex items-center gap-2"><Settings size={18}/> Edit Profile</button>
            {/* If viewing another user, show follow button: <button className="..."><UserPlus size={18}/> Follow</button> */}
          </div>
          <div className="flex gap-8 text-gray-700">
            <span><span className="font-bold">{posts.length}</span> posts</span>
            <span><span className="font-bold">123</span> followers</span>
            <span><span className="font-bold">456</span> following</span>
          </div>
        </div>
      </div>
      {/* Post grid */}
      <div className="grid grid-cols-3 gap-2">
        {loading ? (
          <div className="col-span-3 text-center">Loading...</div>
        ) : error ? (
          <div className="col-span-3 text-red-500">{error}</div>
        ) : posts.length === 0 ? (
          <div className="col-span-3 text-gray-500">No posts yet.</div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="aspect-square bg-gray-100 flex items-center justify-center text-3xl text-gray-400 rounded">
              {/* Replace with post image if available */}
              <span>📷</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 