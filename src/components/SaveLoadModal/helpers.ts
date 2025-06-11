import { options } from "@game/options";
import CryptoJS from "crypto-js";

import {
    ITERATIONS,
    KEY_SIZE,
    SAVE_POSTFIX,
} from "./constants";

const getPassword = () => `${options.gameId}.${SAVE_POSTFIX}`;

export const encodeSf = <T>(data: T) => {
    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    const key = CryptoJS.PBKDF2(getPassword(), salt, {
        keySize: KEY_SIZE,
        iterations: ITERATIONS,
    });
    const iv = CryptoJS.lib.WordArray.random(128 / 8);
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
    });
    const transitMessage =
        salt.toString(CryptoJS.enc.Base64) +
        iv.toString(CryptoJS.enc.Base64) +
        encrypted.toString();

    return new TextEncoder().encode(transitMessage);
};

export const decodeSf = <T>(data: ArrayBuffer): T => {
    const transitMessage = new TextDecoder().decode(data);

    const saltString = transitMessage.substring(0, 24);
    const ivString = transitMessage.substring(24, 48);
    const encryptedString = transitMessage.substring(48);

    const salt = CryptoJS.enc.Base64.parse(saltString);
    const iv = CryptoJS.enc.Base64.parse(ivString);

    const key = CryptoJS.PBKDF2(getPassword(), salt, {
        keySize: KEY_SIZE,
        iterations: ITERATIONS,
    });

    const decrypted = CryptoJS.AES.decrypt(encryptedString, key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
    });

    const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
    if (!jsonString) {
        throw new Error(
            "Failed to decrypt. Data might be corrupted or the password/logic has changed."
        );
    }

    return JSON.parse(jsonString) as T;
};

export const getDateString = (timestamp: Date) => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    const time = date.toLocaleTimeString("default", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    return `${day} of ${month}, ${year} ${time}`;
};
