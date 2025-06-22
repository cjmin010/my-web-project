'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { addLog } from '@/data/logs';

export default function PageTracker() {
  const pathname = usePathname();
  const { user, isLoading } = useUser();
  const previousPathname = useRef<string | null>(null);

  useEffect(() => {
    // isLoading이 false이고, user가 존재하며, 경로가 변경되었을 때 로그를 기록합니다.
    if (!isLoading && user && pathname !== previousPathname.current) {
      // 첫 페이지 로드 시에는 로그를 남기지 않도록 합니다.
      if (previousPathname.current !== null) { 
          addLog(user.id, 'page_view', `Navigated to ${pathname}`);
      }
      previousPathname.current = pathname;
    }
  }, [pathname, user, isLoading]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않습니다.
} 