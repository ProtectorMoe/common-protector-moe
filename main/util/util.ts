export function GetSeedRandom(seed: number, min: number, max: number) {
    max = max || 1;
    min = min || 0;
    seed = (seed * 9301 + 49297) % 233280;
    const rnd = seed / 233280.0;
    return Math.ceil( min + rnd * (max - min) );
}

export async function Delay(time: number) {
    return new Promise(resolve => setTimeout(resolve, time))
}

export function CopyParams(n: object, o: object, params: Array<string>) {
    params.forEach(v => n[v] = o[v])
}

export function MapToObject<K, V>(map: Map<K, V>): object {
    const o = Object.create(null);
    map.forEach((value, key) => o[key] = value);
    return o;
}

export function ObjectToMap<K, V>(o: Object): Map<K, V> {
    const map = new Map<K, V>();
    for (let k in o) {
        if (o.hasOwnProperty(k)) {
            // @ts-ignore
            map.set(k, o[k])
        }
    }
    return map;
}

export function ArrayToList<T>(a: Array<T>) {
    const l = [];
    a.forEach(value => l.push(value));
    return l;
}
