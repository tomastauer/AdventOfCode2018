import { Solution } from 'src/utilities/solver';

export default class Day02 implements Solution {
    async solvePart1(input: string[]) {
        const canvasSize = 1000;
        const canvas = initializeCanvas(canvasSize);
        const entries = input.map(parseLine);
        entries.forEach(entry => {
            for(let x = entry.x; x < entry.x + entry.width; x++) {
                for(let y = entry.y; y < entry.y + entry.height; y++) {
                    canvas[x][y].push(entry.id);
                }
            }
        });
        
        return to1d(canvas).filter(c => c.length > 1).length;
    }

    async solvePart2(input: string[]) {
        const canvasSize = 1000;
        const canvas = initializeCanvas(canvasSize);
        const entries = input.map(parseLine);
        entries.forEach(entry => {
            for(let x = entry.x; x < entry.x + entry.width; x++) {
                for(let y = entry.y; y < entry.y + entry.height; y++) {
                    canvas[x][y].push(entry.id);
                }
            }
        });

        let resultId = 0;
        entries.forEach(entry => {
            let overlaps = false;
            for(let x = entry.x; x < entry.x + entry.width; x++) {
                for(let y = entry.y; y < entry.y + entry.height; y++) {
                    overlaps = overlaps || canvas[x][y].length > 1;
                }
            }

            if(!overlaps) {
                resultId = entry.id;
            }
        });

        return resultId;
    }
}

interface Entry {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

function parseLine(line: string) {
    const pattern = /#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/;
    const match = line.match(pattern)!;
    return {
        id: parseInt(match[1], 10),
        x: parseInt(match[2], 10),
        y: parseInt(match[3], 10),
        width: parseInt(match[4], 10),
        height: parseInt(match[5], 10)
    } as Entry;
}

function to1d(canvas: number[][][]) {
    const arr: any[] = [];
    for (let row of canvas) for (let e of row) arr.push(e);

    return arr;
}

function initializeCanvas(canvasSize: number) {
    return Array.from({length:canvasSize}, () => Array.from({length:canvasSize}, () => [] as number[]));
}
