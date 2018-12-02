export function groupBy<T extends {}>(items: T[], selector: (item: T) => string): { [key: string]: T[] } {
    return items.reduce((agg: {[key: string]: T[]}, curr) => {
        const s = selector(curr);
        (agg[s] = agg[s] || []).push(curr);
        return agg;
    }, {});
}
