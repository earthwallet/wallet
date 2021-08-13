import CryptoJS from 'crypto-js';

export const encryptString = (str: string, password: string): string =>
  CryptoJS.AES.encrypt(str, password).toString();

export const decryptString = (encryptedStr: string, password: string): string =>
  CryptoJS.AES.decrypt(encryptedStr, password).toString(CryptoJS.enc.Utf8);
