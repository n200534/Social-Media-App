"use client";
import { useEffect, useState, useRef } from "react";
import { apiFetch } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { Heart, MessageCircle, Send, Bookmark, ImagePlus } from "lucide-react";

interface Comment {
  id: number;
  user: { username: string };
  text: string;
}

interface Post {
  id: number;
  user_id: number;
  content: string;
  image_url?: string;
  video_url?: string;
  created_at: string;
  user?: { username: string };
  likes?: number;
  comments?: Comment[];
  likedByMe?: boolean;
}

const mockPosts: Post[] = [
  {
    id: 1,
    user_id: 2,
    content: "Just launched my new portfolio website! Really excited to share my latest design work with everyone. The creative process has been incredible ✨",
    image_url: "",
    video_url: "",
    created_at: new Date().toISOString(),
    user: { username: "sarahdesigns" },
    likes: 12,
    comments: [
      { id: 1, user: { username: "alex99" }, text: "Amazing work!" },
      { id: 2, user: { username: "emmawilson" }, text: "Congrats!" },
    ],
    likedByMe: false,
  },
  {
    id: 2,
    user_id: 3,
    content: "Exploring the mountains this weekend! #adventure #photography",
    image_url: "",
    video_url: "",
    created_at: new Date(Date.now() - 3600 * 1000).toISOString(),
    user: { username: "alex99" },
    likes: 8,
    comments: [
      { id: 3, user: { username: "sarahdesigns" }, text: "Looks fun!" },
    ],
    likedByMe: true,
  },
  {
    id: 3,
    user_id: 4,
    content: "Check out my latest digital art piece! Feedback welcome.",
    image_url: "",
    video_url: "",
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    user: { username: "emmawilson" },
    likes: 5,
    comments: [],
    likedByMe: false,
  },
];

function timeAgo(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
}

export default function FeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [postId: number]: string }>({});
  const [expandedComments, setExpandedComments] = useState<{ [postId: number]: boolean }>({});
  const commentInputRefs = useRef<{ [postId: number]: HTMLInputElement | null }>({});
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    apiFetch<Post[]>("/posts/", {}, true)
      .then(data => setPosts(data.length ? data : mockPosts))
      .catch(() => setPosts(mockPosts))
      .finally(() => setLoading(false));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setFilePreview(url);
    } else {
      setFilePreview(null);
    }
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);
    setError(null);
    try {
      let newPost: Post;
      if (file) {
        const formData = new FormData();
        formData.append("content", content);
        formData.append("file", file);
        newPost = await apiFetch<Post>("/posts/", {
          method: "POST",
          body: formData,
          headers: {}, // Let browser set Content-Type
        }, true);
      } else {
        newPost = await apiFetch<Post>("/posts/", {
          method: "POST",
          body: JSON.stringify({ content }),
          headers: { 'Content-Type': 'application/json' },
        }, true);
      }
      setPosts([newPost, ...posts]);
      setContent("");
      setFile(null);
      setFilePreview(null);
      setToast("Post created!");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setPosting(false);
      setTimeout(() => setToast(null), 2000);
    }
  };

  const handleLike = (postId: number) => {
    setPosts(posts => posts.map(post =>
      post.id === postId
        ? { ...post, likedByMe: !post.likedByMe, likes: (post.likes || 0) + (post.likedByMe ? -1 : 1) }
        : post
    ));
    setToast("Liked!");
    setTimeout(() => setToast(null), 1500);
  };

  const handleCommentInput = (postId: number, value: string) => {
    setCommentInputs(inputs => ({ ...inputs, [postId]: value }));
  };

  const handleAddComment = (postId: number) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    setPosts(posts => posts.map(post =>
      post.id === postId
        ? { ...post, comments: [...(post.comments || []), { id: Date.now(), user: { username: user?.username || "you" }, text }] }
        : post
    ));
    setCommentInputs(inputs => ({ ...inputs, [postId]: "" }));
    setToast("Comment added!");
    // Blur the input after posting
    setTimeout(() => {
      commentInputRefs.current[postId]?.blur();
      setToast(null);
    }, 1200);
  };

  const handleToggleComments = (postId: number) => {
    setExpandedComments(exp => {
      const next = { ...exp, [postId]: !exp[postId] };
      // If expanding, focus the input after render
      if (next[postId]) {
        setTimeout(() => {
          commentInputRefs.current[postId]?.focus();
        }, 100);
      }
      return next;
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto py-8">
      {/* Toast */}
      {toast && <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-6 py-2 rounded shadow z-50 animate-fade-in">{toast}</div>}
      {/* Post creation block */}
      <div className="mb-6">
        <form onSubmit={handlePost} className="bg-white rounded-lg shadow p-6 flex flex-col gap-3 border border-gray-100" encType="multipart/form-data">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-purple-700">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
            <span className="text-gray-500 font-medium">Start a post...</span>
          </div>
          {/* Large image/video preview */}
          {filePreview && (
            <div className="relative w-full max-w-xs mx-auto aspect-square mb-2 flex items-center justify-center">
              {file?.type.startsWith('image') ? (
                <img src={filePreview} alt="preview" className="w-full h-full object-cover rounded-lg border" />
              ) : (
                <video src={filePreview} className="w-full h-full object-cover rounded-lg border" controls />
              )}
              <button type="button" className="absolute top-2 right-2 bg-white/80 border border-gray-300 rounded-full px-2 py-0.5 text-lg font-bold shadow hover:bg-white" onClick={() => { setFile(null); setFilePreview(null); }} aria-label="Remove preview">✕</button>
            </div>
          )}
          <textarea
            className="w-full px-3 py-2 border rounded resize-none focus:ring-2 focus:ring-purple-200"
            placeholder="What's on your mind?"
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={2}
            required
          />
          {/* File input */}
          <div className="flex items-center gap-4">
            <label className="cursor-pointer flex items-center justify-center w-10 h-10 bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition" title="Add image or video">
              <span className="sr-only">Add image or video</span>
              <ImagePlus size={22} />
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
          <button type="submit" className="self-end px-6 py-2 font-bold text-white bg-purple-600 rounded-full shadow hover:bg-purple-700 transition" disabled={posting}>
            {posting ? "Posting..." : "Post"}
          </button>
        </form>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-lg shadow animate-pulse h-80" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {posts.map(post => {
            const expanded = expandedComments[post.id];
            return (
              <div key={post.id} className="bg-white rounded-lg shadow transition hover:shadow-lg group">
                {/* Post header */}
                <div className="flex items-center gap-3 px-4 pt-4 pb-2">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-purple-700">
                    {post.user?.username?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="font-semibold">{post.user?.username || "user"}</div>
                  <div className="ml-auto text-xs text-gray-400">{timeAgo(post.created_at)}</div>
                </div>
                {/* Post image placeholder */}
                <div className="w-full aspect-square bg-gray-100 flex items-center justify-center text-gray-400 text-4xl">
                  <span>📷</span>
                </div>
                {/* Post actions */}
                <div className="flex items-center gap-6 px-4 py-2">
                  <button
                    className={`transition ${post.likedByMe ? 'text-pink-500' : 'text-gray-500'} rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-300`}
                    onClick={() => handleLike(post.id)}
                    aria-label="Like"
                  >
                    <Heart size={22} className="group-hover:scale-110 transition-transform" fill={post.likedByMe ? '#ec4899' : 'none'} />
                  </button>
                  <button
                    className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full"
                    aria-label="Comment"
                    onClick={() => handleToggleComments(post.id)}
                  >
                    <MessageCircle size={22} className="group-hover:scale-110 transition-transform" />
                  </button>
                  <button className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-300 rounded-full" aria-label="Share">
                    <Send size={22} className="group-hover:scale-110 transition-transform" />
                  </button>
                  <div className="ml-auto">
                    <button className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 rounded-full" aria-label="Bookmark">
                      <Bookmark size={22} className="group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
                {/* Like/comment counts */}
                <div className="px-4 pb-1 text-sm text-gray-700 flex gap-4">
                  <span className="font-semibold">{post.likes || 0} likes</span>
                  <span className="text-gray-500">{post.comments?.length || 0} comments</span>
                </div>
                {/* Post caption */}
                <div className="px-4 pb-2">
                  <span className="font-semibold mr-2">{post.user?.username || "user"}</span>
                  {post.content}
                </div>
                {/* Comments section: only show when expanded */}
                {expanded && (
                  <div className="px-4 pb-2 space-y-1">
                    {post.comments && post.comments.length > 0 ? (
                      post.comments.map(c => (
                        <div key={c.id} className="text-sm"><span className="font-semibold">{c.user.username}</span> {c.text}</div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-400">No comments yet.</div>
                    )}
                    <form
                      className="flex items-center gap-2 pt-2 border-t mt-2"
                      onSubmit={e => { e.preventDefault(); handleAddComment(post.id); }}
                    >
                      <input
                        ref={el => { commentInputRefs.current[post.id] = el; }}
                        className="flex-1 px-3 py-2 border rounded-full text-sm focus:ring-2 focus:ring-blue-200 bg-gray-50"
                        placeholder="Add a comment..."
                        value={commentInputs[post.id] || ""}
                        onChange={e => handleCommentInput(post.id, e.target.value)}
                      />
                      <button
                        type="submit"
                        className={`px-4 py-1 rounded-full font-semibold transition-colors ${commentInputs[post.id]?.trim() ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                        disabled={!commentInputs[post.id]?.trim()}
                      >
                        Post
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 