import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;

/**
 * AES-256-GCM encrypt/decrypt + SHA-256 hashing for credentials at rest
 * (e.g. encrypted test data files). No external dependency - built on
 * Node's crypto module.
 */
export class EncryptionUtils {
  public static encrypt(plainText: string, secretKey: string): string {
    const key = crypto.createHash('sha256').update(secretKey).digest();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    const encrypted = Buffer.concat([cipher.update(plainText, 'utf-8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return Buffer.concat([iv, authTag, encrypted]).toString('base64');
  }

  public static decrypt(cipherText: string, secretKey: string): string {
    const key = crypto.createHash('sha256').update(secretKey).digest();
    const data = Buffer.from(cipherText, 'base64');
    const iv = data.subarray(0, IV_LENGTH);
    const authTag = data.subarray(IV_LENGTH, IV_LENGTH + 16);
    const encrypted = data.subarray(IV_LENGTH + 16);
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf-8');
  }

  public static sha256(value: string): string {
    return crypto.createHash('sha256').update(value).digest('hex');
  }
}
