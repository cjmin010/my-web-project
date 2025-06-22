// data/logs.ts

export interface LogEntry {
  id: string; // Unique ID for each log entry
  userId: string;
  action: 'login' | 'logout' | 'page_view';
  details: string; // e.g., page path for 'page_view'
  timestamp: string;
}

const LOGS_STORAGE_KEY = 'mini_store_logs';

/**
 * 저장된 모든 로그를 최신순으로 가져옵니다.
 * @returns {LogEntry[]} 로그 배열
 */
export const getLogs = (): LogEntry[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  const storedLogs = localStorage.getItem(LOGS_STORAGE_KEY);
  return storedLogs ? JSON.parse(storedLogs) : [];
};

/**
 * 새로운 로그를 추가합니다.
 * @param userId - 활동을 수행한 사용자 ID
 * @param action - 활동 유형 ('login', 'logout', 'page_view')
 * @param details - 추가 정보 (예: 페이지 경로)
 */
export const addLog = (userId: string, action: 'login' | 'logout' | 'page_view', details: string = ''): void => {
  if (typeof window === 'undefined') {
    return;
  }
  const logs = getLogs();
  const newLog: LogEntry = {
    id: `${new Date().toISOString()}-${Math.random().toString(36).substr(2, 9)}`, // 고유 ID 생성
    userId,
    action,
    details,
    timestamp: new Date().toISOString(),
  };
  logs.unshift(newLog); // 최신 로그가 위로 오도록 배열 맨 앞에 추가
  localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
}; 