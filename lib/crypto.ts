// SHA256 해시 함수
export const hashPassword = async (password: string): Promise<string> => {
    // 입력받은 비밀번호를 SHA256으로 해시합니다.
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
};

// 비밀번호 검증 함수 (입력값을 SHA256으로 해시하여 저장된 해시와 비교)
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    const hashedInput = await hashPassword(password);
    return hashedInput === hashedPassword;
}; 