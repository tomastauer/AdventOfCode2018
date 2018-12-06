import { Solution } from 'src/utilities/solver';
import { areAllItemsSame, groupBy, findMostOftenItem } from '../../utilities/array';

export default class Day02 implements Solution {
    async solvePart1(input: string[]) {
        let canvasSize = 358;
        const canvas = initializeCanvas(canvasSize);
        const parsedInput = parseInput(input);
        initializeWithInputDistance(canvas, parsedInput);
        const distanceMap = computeDistanceMap(canvas);
        const withoutBoundaries = removeBoundaryAreas(trimCanvas(removeSameDistances(distanceMap, parsedInput)));
        return findMostOftenItem(([] as number[]).concat(...extractFrom(withoutBoundaries)).filter(c => c !== 0)).occurrences;
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

    return canvas;
}

function removeSameDistances(canvas: Distance[][], originalPoints: Point[]) {
    for(let x = 0; x < canvas.length; x++) {
        for(let y = 0; y < canvas.length; y++) {
            if(getDistances({x, y}, originalPoints).filter(d => d === canvas[x][y].distance).length > 1){
                canvas[x][y].from = 0;
            }
        }
    }

    return canvas;
}

function getDistances(point: Point, points: Point[]) {
    return points.map(p => Math.abs(point.x - p.x) + Math.abs(point.y - p.y));
}

function removeBoundaryAreas(canvas: Distance[][]) {
    const boundaries = new Set<number>();
    for(let d = 0; d < canvas.length; d++) {
        boundaries.add(canvas[0][d].from);
        boundaries.add(canvas[canvas.length-1][d].from);
        boundaries.add(canvas[d][0].from);
        boundaries.add(canvas[canvas.length-1][d].from);
    }

    console.log(boundaries);
    for(let x = 0; x < canvas.length; x++) {
        for(let y = 0; y < canvas.length; y++) {
            if(boundaries.has(canvas[x][y].from!)) {
                canvas[x][y].from = 0;
            }
        }
    }

    return canvas;
}

function selectCorrectDistance(root: Distance, x: Distance, y: Distance): Distance {
    const minDistance = Math.min(root.distance, x.distance + 1, y.distance + 1);
    if(root.distance === minDistance) {
        return root;
    }

    return x.distance < y.distance ? ({ from: x.from, distance: x.distance + 1 }) : ({ from: y.from, distance: y.distance + 1 });
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

function parseInput(lines: string[]): Point[] {
    return  lines.map(line => line.split(',').map(p => parseInt(p, 10)+1)).map(i => ({x: i[1], y: i[0]}));
}

function initializeWithInputDistance(canvas: Distance[][], points: Point[]) {
    points.forEach((point, index) => {
        canvas[point.x][point.y] = { from: index + 1, distance: 0 } as Distance;
    });
}

interface Point {
    x: number;
    y: number;
}
interface Distance {
    from: number;
    distance: number;
    invalid?: boolean;
}

function extractFrom(canvas: Distance[][]) {
    return canvas.map(row => row.map(col => col.from));
}
