'use client';

export interface SecuritySettings {
  maxLoginAttempts: number;
  minPasswordLength: number;
}

const SECURITY_SETTINGS_KEY = 'mini_store_security_settings';

const defaultSettings: SecuritySettings = {
  maxLoginAttempts: 3,
  minPasswordLength: 9,
};

/**
 * 보안 설정을 로컬 스토리지에서 가져옵니다.
 * 설정이 없으면 기본값을 저장하고 반환합니다.
 * @returns {SecuritySettings} 보안 설정 객체
 */
export const getSecuritySettings = (): SecuritySettings => {
  if (typeof window === 'undefined') {
    return defaultSettings;
  }
  const storedSettings = localStorage.getItem(SECURITY_SETTINGS_KEY);
  if (storedSettings) {
    // 저장된 설정과 기본 설정의 키를 비교하여 누락된 키가 있으면 기본값으로 채워줍니다.
    const parsedSettings = JSON.parse(storedSettings);
    return { ...defaultSettings, ...parsedSettings };
  }
  localStorage.setItem(SECURITY_SETTINGS_KEY, JSON.stringify(defaultSettings));
  return defaultSettings;
};

/**
 * 보안 설정을 로컬 스토리지에 저장합니다.
 * @param {Partial<SecuritySettings>} settings - 업데이트할 설정
 */
export const saveSecuritySettings = (settings: Partial<SecuritySettings>) => {
  if (typeof window === 'undefined') {
    return;
  }
  const currentSettings = getSecuritySettings();
  const newSettings = { ...currentSettings, ...settings };
  localStorage.setItem(SECURITY_SETTINGS_KEY, JSON.stringify(newSettings));
}; 