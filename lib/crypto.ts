import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const ENCRYPTION_KEY = "mantul-banget-admin-panel-202602"; // Harus 32 karakter
const IV_LENGTH = 16;

export function encryptPath(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decryptPath(text: string) {
  try {
    // 1. Validasi awal: pastikan text ada dan mengandung pemisah ':'
    if (!text || !text.includes(":")) {
      console.error("Decrypt: Format string tidak valid (Missing IV separator)");
      return null;
    }

    const textParts = text.split(":");
    const ivHex = textParts.shift();
    const encryptedHex = textParts.join(":");

    // 2. Validasi panjang IV (AES-256-CBC butuh 16 bytes = 32 karakter hex)
    if (!ivHex || ivHex.length !== 32) {
      console.error("Decrypt: Panjang IV tidak valid");
      return null;
    }

    const iv = Buffer.from(ivHex, "hex");
    const encryptedText = Buffer.from(encryptedHex, "hex");
    
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString("utf8");
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}