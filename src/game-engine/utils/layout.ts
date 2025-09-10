export function distribute(num_items: number, width: number, margin: number = 0): Array<number> {
    const result = new Array(num_items).fill(0).map((item, i) =>
        get_distribution(num_items, i, width, margin)
    )
    return result;
}

export function get_distribution(num_items: number, i: number, width: number, margin: number = 0): number {
    return margin + (width - margin * 2) * (i / (num_items - 1))
}