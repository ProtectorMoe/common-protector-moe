/* eslint-disable */
export function GetSeedRandom(seed: number, min: number, max: number): number {
    max = max || 1;
    min = min || 0;
    seed = (seed * 9301 + 49297) % 233280;
    const rnd = seed / 233280.0;
    return Math.ceil( min + rnd * (max - min) );
}

export async function Delay(time: number):Promise<void> {
    return new Promise(resolve => setTimeout(resolve, time))
}

export function CopyParams(n: object, o: object, params: Array<string>) {
    params.forEach(v => n[v] = o[v])
}

export function MapToObject<K, V>(map: Map<K, V>): object {
    const o = {};
    // @ts-ignore
    map.forEach((value, key) => o[key] = value);
    Object.defineProperty(o, '__type', {
        value: typeof map.keys().next().value
    });
    return o;
}

export function ObjectToMap<K, V>(o: any): Map<K, V> {
    const type = o.__type;
    const map = new Map<K, V>();
    for (let k in o) {
        if (o.hasOwnProperty(k)) {
            // @ts-ignore
            map.set(type == 'number'? parseInt(k): k, o[k])
        }
    }
    return map;
}


export function SetLog(dec: string, type=''): void {
    const {ipcRenderer} = require('electron');
    const date = new Date();
    ipcRenderer.send('setLog', {
        date: `${date.getMonth()}/${date.getDay()}`,
        time: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
        dec,
        type
    });
}

export async function fetchAsync(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
        fetch(url).then(value => value.json()).then(value => resolve(value)).catch(reason => reject(reason))
    })
}
