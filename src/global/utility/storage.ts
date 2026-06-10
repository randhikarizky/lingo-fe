import aes from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";
import Cookies from "universal-cookie";

const kue = new Cookies();

const secretKey = `${process.env.NEXT_PUBLIC_ENCRYPT_STORAGE_SECRET_KEY}`;
export const encryptStorage = {
  setItem(key: string, value: string): void {
    const encryptedValue = aes.encrypt(value, secretKey);
    kue.set(key, encryptedValue.toString(), { path: "/" });
  },
  getItem(key: string): string | null {
    const item = kue.get(key);
    if (item) {
      return aes.decrypt(item, secretKey).toString(Utf8);
    }
    return null;
  },
  removeItem(key: string): void {
    kue.remove(key, { path: "/" });
  },
};
