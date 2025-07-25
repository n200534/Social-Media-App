'use client';
import { usePathname } from 'next/navigation';
import Rightbar from './Rightbar';

export default function ClientLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showRightbar = pathname !== '/messages';

  return (
    <div className="flex justify-center min-h-screen pt-4">
      <main className="w-full max-w-xl flex flex-col items-center px-2">{children}</main>
      {showRightbar && <div className="hidden lg:block"><Rightbar /></div>}
    </div>
  );
} 