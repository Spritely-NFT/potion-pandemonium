export function rand_range(min: number, max: number) {
    return min + Math.random() * (max - min);
}

export function rand_range_int(min: number, max: number) {
    return Math.floor(rand_range(min, max));
}