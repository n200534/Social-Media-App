"use client";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import FeedPage from "./feed/page";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.replace("/auth");
  }, [user, router]);

  if (!user) return null;
  return <FeedPage />;
}
