// // encriptador.ts
// import crypto from 'crypto';

// const ENCRYPTION_KEY = process.env.ENCRYPT_KEY ?? ''; // 32 caracteres
// const IV_LENGTH = 16; // AES usa un IV de 16 bytes

// export function encrypt(text: string): string {
//     const iv = crypto.randomBytes(IV_LENGTH);
//     const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
//     let encrypted = cipher.update(text);
//     encrypted = Buffer.concat([encrypted, cipher.final()]);
//     return iv.toString('hex') + ':' + encrypted.toString('hex');
// }

// export function decrypt(text: string): string {
//     const textParts = text.split(':');
//     const iv = Buffer.from(textParts[0], 'hex');
//     const encryptedText = Buffer.from(textParts[1], 'hex');
//     const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
//     let decrypted = decipher.update(encryptedText);
//     decrypted = Buffer.concat([decrypted, decipher.final()]);
//     return decrypted.toString();
// }

import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPT_KEY ?? ''; // 32 caracteres
const IV_LENGTH = 12; // GCM recomienda 12 bytes (96 bits)
const ALGORITHM = 'aes-256-gcm';

if (Buffer.from(ENCRYPTION_KEY).length !== 32) {
    throw new Error('ENCRYPTION_KEY debe tener exactamente 32 bytes');
}

export function encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = Buffer.from(ENCRYPTION_KEY, 'utf-8');
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();

    // Devolvemos IV:encrypted:authTag en hex
    return `${iv.toString('hex')}:${encrypted.toString('hex')}:${authTag.toString('hex')}`;
}

export function decrypt(text: string): string {
    const [ivHex, encryptedHex, authTagHex] = text.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedText = Buffer.from(encryptedHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const key = Buffer.from(ENCRYPTION_KEY, 'utf-8');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);

    return decrypted.toString('utf8');
}
