export async function generateKey(): Promise<CryptoKey> {
    return window.crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    );
}

export async function importKey(rawKey: string): Promise<CryptoKey> {
    // Convert base64 string back to buffer
    const binaryString = window.atob(rawKey);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    return window.crypto.subtle.importKey(
        "raw",
        bytes,
        "AES-GCM",
        true,
        ["encrypt", "decrypt"]
    );
}

export async function exportKey(key: CryptoKey): Promise<string> {
    const exported = await window.crypto.subtle.exportKey("raw", key);
    const exportedBuffer = new Uint8Array(exported);
    let binaryString = "";
    for (let i = 0; i < exportedBuffer.byteLength; i++) {
        binaryString += String.fromCharCode(exportedBuffer[i]);
    }
    return window.btoa(binaryString);
}

export async function encryptData(data: object, key: CryptoKey): Promise<{ encrypted: string; iv: string }> {
    const encodedData = new TextEncoder().encode(JSON.stringify(data));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const encryptedContent = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        key,
        encodedData
    );

    // Convert encrypted content to base64
    const encryptedBuffer = new Uint8Array(encryptedContent);
    let binaryString = "";
    for (let i = 0; i < encryptedBuffer.byteLength; i++) {
        binaryString += String.fromCharCode(encryptedBuffer[i]);
    }
    const base64Encrypted = window.btoa(binaryString);

    // Convert IV to base64
    let ivString = "";
    for (let i = 0; i < iv.byteLength; i++) {
        ivString += String.fromCharCode(iv[i]);
    }
    const base64Iv = window.btoa(ivString);

    return { encrypted: base64Encrypted, iv: base64Iv };
}

export async function decryptData(encryptedData: string, iv: string, key: CryptoKey): Promise<object> {
    // Convert base64 params back to buffers
    const encryptedBinary = window.atob(encryptedData);
    const encryptedBytes = new Uint8Array(encryptedBinary.length);
    for (let i = 0; i < encryptedBinary.length; i++) {
        encryptedBytes[i] = encryptedBinary.charCodeAt(i);
    }

    const ivBinary = window.atob(iv);
    const ivBytes = new Uint8Array(ivBinary.length);
    for (let i = 0; i < ivBinary.length; i++) {
        ivBytes[i] = ivBinary.charCodeAt(i);
    }

    const decryptedContent = await window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: ivBytes,
        },
        key,
        encryptedBytes
    );

    const decodedData = new TextDecoder().decode(decryptedContent);
    return JSON.parse(decodedData);
}
