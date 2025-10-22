import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const IV_LENGTH = 16;

/**
 * 민감한 데이터를 암호화합니다 (카드번호, CVV 등)
 */
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = Buffer.from(ENCRYPTION_KEY.slice(0, 64), 'hex');
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * 암호화된 데이터를 복호화합니다
 */
export function decrypt(text: string): string {
  const parts = text.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encryptedText = parts[1];
  const key = Buffer.from(ENCRYPTION_KEY.slice(0, 64), 'hex');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * 카드번호에서 마지막 4자리 추출
 */
export function getLast4Digits(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  return cleaned.slice(-4);
}

/**
 * 카드번호 유효성 검사 (Luhn 알고리즘)
 */
export function validateCardNumber(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  if (!/^\d{13,19}$/.test(cleaned)) {
    return false;
  }
  
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

/**
 * 카드 브랜드 감지 (카드번호 첫 자리 기준)
 */
export function detectCardBrand(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  if (/^4/.test(cleaned)) return 'VISA';
  if (/^5[1-5]/.test(cleaned)) return 'MASTERCARD';
  if (/^3[47]/.test(cleaned)) return 'AMEX';
  if (/^6(?:011|5)/.test(cleaned)) return 'DISCOVER';
  if (/^3(?:0[0-5]|[68])/.test(cleaned)) return 'DINERS';
  if (/^35/.test(cleaned)) return 'JCB';
  if (/^62/.test(cleaned)) return 'UNIONPAY';
  
  return 'UNKNOWN';
}

/**
 * 카드번호 마스킹 (표시용)
 */
export function maskCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  const last4 = cleaned.slice(-4);
  const masked = '*'.repeat(cleaned.length - 4) + last4;
  
  // 4자리씩 공백으로 구분
  return masked.match(/.{1,4}/g)?.join(' ') || masked;
}
