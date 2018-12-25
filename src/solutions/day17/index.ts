import { Solution } from '../../utilities/solver';
import { groupBy } from '../../utilities/array';
const PNGImage = require('pngjs-image');

export default class Day02 implements Solution {
    async solvePart1(input: string[]) {
        const parsedInput = parseInput(input);
        const canvas = parsedInput[0] as string[][];
        spil(canvas, { x: 500, y: 0}, parsedInput[1] as number);
        return countWater(canvas, parsedInput[1] as number, parsedInput[2] as number);
    }

    async solvePart2(input: string[]) {
        const parsedInput = parseInput(input);
        const canvas = parsedInput[0] as string[][];
        spil(canvas, { x: 500, y: 0}, parsedInput[1] as number);
        return countRemainingWater(canvas, parsedInput[1] as number, parsedInput[2] as number);
    }
}

interface Point {
    x: number;
    y: number;
}

function parseInput(input: string[]) {
    const pattern = /(x|y)=(\d+), (x|y)=(\d+)..(\d+)/;
    const canvas = initializeCanvas();
    let maxY = 0;
    let minY = 100000;
    input.forEach(i => {
        const match = pattern.exec(i)!;
        const firstX = match[1] === 'x';
        const first = parseInt(match[2]);
        const rangeA = parseInt(match[4]);
        const rangeB = parseInt(match[5]);
        if(!firstX) {
            maxY = Math.max(maxY, first);
            
        }

        if(firstX) {
            minY = Math.min(minY, rangeA);
        }


        for(let i = rangeA; i <= rangeB; i++) {
            if(firstX) {
                canvas[i][first] = '#';
            } else {
                canvas[first][i] = '#';
            }
        }
    });

    return [canvas, maxY, minY];
}


function spilToLeft(canvas: string[][], point: Point, maxY: number) {
    if(canvas[point.y + 1][point.x] !== '#' && canvas[point.y + 1][point.x] !== '~') {
        return;
    }

    if(canvas[point.y][point.x - 1] === '#') {
        restToRight(canvas, point, point.x, maxY);
    }

    if(canvas[point.y][point.x - 1] === '.') {
        spil(canvas, {x: point.x - 1, y: point.y}, maxY);
    }
}

function spilToRight(canvas: string[][], point: Point, maxY: number) {
    if(canvas[point.y + 1][point.x] !== '#' && canvas[point.y + 1][point.x] !== '~') {
        return;
    }

    if(canvas[point.y][point.x + 1] === '#') {
        restToLeft(canvas, point, point.x);
    }

    if(canvas[point.y][point.x + 1] === '.') {
        spil(canvas, {x: point.x + 1, y: point.y}, maxY);
    }
}

function restToRight(canvas: string[][], point: Point, origin: number, maxY: number) {
    if(canvas[point.y][point.x] === '.' && canvas[point.y][point.x-1] !== '#') {
        spilToRight(canvas, {x: point.x-1, y:point.y}, maxY);
    }
    
    if(canvas[point.y][point.x] !== '|' && canvas[point.y][point.x] !== 'l') {
        return;
    }

    if(canvas[point.y][point.x] === 'l') {
        canvas[point.y][point.x] = '~';
    } else {
        canvas[point.y][point.x] = 'r';
    }
    restToRight(canvas, {x: point.x + 1, y: point.y}, origin, maxY);
}

function restToLeft(canvas: string[][], point: Point, origin: number) {
    if(canvas[point.y][point.x] !== '|' && canvas[point.y][point.x] !== 'r') {
        return;
    }
    if(canvas[point.y][point.x] === 'r') {
        canvas[point.y][point.x] = '~';
    } else {
        canvas[point.y][point.x] = 'l';
    }
    restToLeft(canvas, {x: point.x - 1, y: point.y}, origin);
}

function spilDown(canvas: string[][], point: Point, maxY: number) {
    if(canvas[point.y + 1][point.x] === '.') {
        spil(canvas, {x: point.x, y: point.y + 1}, maxY);
    }
}

function spil(canvas: string[][], point: Point, maxY: number) {
    canvas[point.y][point.x] = '|';
    
    if(point.y < maxY) {
        spilDown(canvas, point, maxY);
        spilToLeft(canvas, point, maxY);
        spilToRight(canvas, point, maxY);
        spilToLeft(canvas, point, maxY);
        spilToRight(canvas, point, maxY);
    }
}


function printCanvas(canvas: string[][]) {
    const ySize = canvas.length;
    const xSize = canvas[0].length;
    const image = PNGImage.createImage(xSize, ySize);
    const colors = {
        '#': { red:0, green:0, blue:0, alpha:255 },
        '~': { red:0, green:0, blue:255, alpha:255 },
        '.': { red:255, green:255, blue:255, alpha:255 },
        '|': { red:0, green:0, blue:255, alpha:255 },
        'r': { red:0, green:0, blue:255, alpha:255 },
        'l': { red:0, green:0, blue:255, alpha:255 }
    } as any
    
    const getColor = (x: number, y: number) => colors[canvas[y][x]];
    
    for(let y = 0; y < ySize; y++) {
        for(let x = 0; x < xSize; x++) {
            image.setAt(x, y, getColor(x, y));
        }
    }

    image.writeImage('output.png', function (err: any) {
        if (err) throw err;
        console.log('Written to the file');
    });
}

function initializeCanvas() {
    return Array.from({length:2000}, () => Array.from({length:550}, () => '.'));
}

function countWater(canvas: string[][], maxY: number, minY: number) {
    const ySize = canvas.length;
    const xSize = canvas[0].length;
    let counter = 0;
    for(let y = minY; y <= maxY; y++) {
        for(let x = 0; x < xSize; x++) {
            if(canvas[y][x] !== '.' && canvas[y][x] !== '#') {
                counter++;
            }
        }
    }
    return counter;
}


function countRemainingWater(canvas: string[][], maxY: number, minY: number) {
    const ySize = canvas.length;
    const xSize = canvas[0].length;
    let counter = 0;
    for(let y = minY; y <= maxY; y++) {
        for(let x = 0; x < xSize; x++) {
            if(canvas[y][x] === '~') {
                counter++;
            }
        }
    }
    return counter;
}
