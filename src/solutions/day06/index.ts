import { Solution } from 'src/utilities/solver';
import { format } from 'path';

export default class Day02 implements Solution {
    async solvePart1(input: string[]) {
        let canvasSize = 14;
        const canvas = initializeCanvas(canvasSize);
        initializeWithInputDistance(canvas, input);
        const distanceMap = computeDistanceMap(canvas);
        
        console.log(extractFrom(distanceMap));
        return '';
    }

    async solvePart2(input: string[]) {
        return '';
    }
}

function computeDistanceMap(canvas: Distance[][]) {
    for(let x = 1; x < canvas.length; x++) {
        for(let y = 1; y < canvas.length; y++) {
            canvas[x][y] = selectCorrectDistance(canvas[x][y], canvas[x-1][y], canvas[x][y-1]);
        }
    }

    for(let x = canvas.length - 2; x >= 0; x--) {
        for(let y = canvas.length - 2; y >= 0; y--) {
            canvas[x][y] = selectCorrectDistance(canvas[x][y], canvas[x+1][y], canvas[x][y+1]);
        }
    }

    return trimCanvas(canvas);
}

function selectCorrectDistance(root: Distance, x: Distance, y: Distance): Distance {
    const minDistance = Math.min(root.distance, x.distance + 1, y.distance + 1);
    const result = root.distance === minDistance ? root : x.distance > y.distance ? ({ from: y.from, distance: y.distance + 1 }) : ({ from: x.from, distance: x.distance + 1 })

    if(root.distance === x.distance + 1 || x.distance + 1 === y.distance + 1 || root.distance === y.distance + 1) {
        result.invalid = true;
    }

    return result;
}

function initializeCanvas(canvasSize: number) {
    return Array.from({length:canvasSize}, () => Array.from({length:canvasSize}, () => ({ distance: 1000 }) as Distance));
}


function trimCanvas(canvas: Distance[][]) {
    const newSize = canvas.length - 2;
    const newCanvas = initializeCanvas(canvas.length - 2);
    for(let x = 0; x < newSize; x++) {
        for(let y = 0; y < newSize; y++) {
            newCanvas[x][y] = canvas[x + 1][y + 1];
        }
    }

    return newCanvas;
}

function initializeWithInputDistance(canvas: Distance[][], lines: string[]) {
    console.log(lines);
    lines.map(line => line.split(',').map(p => parseInt(p, 10)+1)).forEach((input, index) => {
        canvas[input[1]][input[0]] = { from: index + 1, distance: 0 } as Distance;
    });
}

interface Distance {
    from?: number;
    distance: number;
    invalid?: boolean;
}

function extractFrom(canvas: Distance[][]) {
    return canvas.map(row => row.map(col => col.invalid ? '.' : '#'));
}

