import * as crypto from 'crypto';

export class EncryptionService {
    private static SHARED_KEY = Buffer.from('12345678901234567890123456789012');
    private static SHARE_IV = crypto.randomBytes(16);
    private static SHARE_ALGORITHM = 'aes-256-cbc';
  
    static encrypt(payload: object): object {
      const cipher = crypto.createCipheriv(this.SHARE_ALGORITHM, this.SHARED_KEY, this.SHARE_IV);
      let encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const ivHex = this.SHARE_IV.toString('hex')

      return { encrypted, iv: ivHex };
    }
  
    static decrypt(encrypted: string, iv: string): object {
      const decipher = crypto.createDecipheriv(this.SHARE_ALGORITHM, this.SHARED_KEY, Buffer.from(iv, 'hex'));
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return JSON.parse(decrypted);
    }
}