export function getSeedRandom(seed: number, min: number, max: number) {
    max = max || 1;
    min = min || 0;
    seed = (seed * 9301 + 49297) % 233280;
    const rnd = seed / 233280.0;
    return Math.ceil( min + rnd * (max - min) );
}

export async function delay(time: number) {
    return new Promise(resolve => setTimeout(resolve, time))
}
