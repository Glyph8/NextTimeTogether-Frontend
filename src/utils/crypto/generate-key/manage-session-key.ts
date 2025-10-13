import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

// 서버 전용 암호화 키 (환경 변수)
const COOKIE_ENCRYPTION_KEY = process.env.COOKIE_ENCRYPTION_KEY!; // 32 bytes

export function encryptKey(masterKey: string|ArrayBuffer): string {
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-gcm', Buffer.from(COOKIE_ENCRYPTION_KEY, 'hex'), iv);
  
  let encrypted: string;

  // masterKey가 array buffer 타입인 경우도 처리
  if (masterKey instanceof ArrayBuffer) {
    encrypted = cipher.update(Buffer.from(masterKey)).toString('hex');
  } else {
    encrypted = cipher.update(masterKey, 'utf8', 'hex');
  }

  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`;
}

export function decryptKey(encryptedKey: string): string {
  const [ivHex, encrypted, authTagHex] = encryptedKey.split(':');
  const decipher = createDecipheriv(
    'aes-256-gcm',
    Buffer.from(COOKIE_ENCRYPTION_KEY, 'hex'),
    Buffer.from(ivHex, 'hex')
  );
  
  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}