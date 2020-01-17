import {GameConfig} from "../game/game-config";
const crypto = require('crypto');

export function encryptionHMAC(url: string, date: Date): string {
    const myUrl = new URL(url);
    const stringToSign: string = 'POST\n' + date.toUTCString().trimRight() + "\n" + myUrl.pathname;
    return crypto.createHmac('sha1', GameConfig.getInstance().authKey).update(stringToSign).digest().toString('base64')
}

export function stringToMd5(data: string) {
    const hash = crypto.createHash('md5');
    hash.update(data);
    return hash.digest('hex')
}
