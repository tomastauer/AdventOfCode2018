import { Solution } from 'src/utilities/solver';

export default class Day02 implements Solution {
    async solvePart1(input: string[]) {
        const parsedInput = input.map(parseInput);
        let time = 0;
        let minHeight = 999999999;

        while(true) {
            const newHeight = getHeight(getStateAt(parsedInput, time));
            if(newHeight < minHeight) {
                minHeight = newHeight;
                time++;
            } else {
                time--;
                break;
            }
        }
        print(getStateAt(parsedInput, time))
        return '';
    }

    async solvePart2(input: string[]) {
        const parsedInput = input.map(parseInput);
        let time = 0;
        let minHeight = 999999999;

        while(true) {
            const newHeight = getHeight(getStateAt(parsedInput, time));
            if(newHeight < minHeight) {
                minHeight = newHeight;
                time++;
            } else {
                time--;
                break;
            }
        }
        return time;
    }
}

interface Input {
    x: number;
    y: number;
    dx: number;
    dy: number;
}

interface Point {
    x: number;
    y: number;
}

function print(points: Point[]) {
    for(let y = Math.min(...points.map(i => i.y)); y <= Math.max(...points.map(i => i.y)); y++) {
        const line = [];
        for(let x = Math.min(...points.map(i => i.x)); x < Math.max(...points.map(i => i.x)); x++) {
            if(points.some(p => p.x === x && p.y === y)) {
                line.push('#');
            } else {
                line.push('.');
            }
        }
        console.log(line.join(''));
    }
}

function parseInput(input: string) {
    const match = /position=<\s*([-\d]+),\s*([-\d]+)> velocity=<\s*([-\d]+),\s*([-\d]+)>/.exec(input);
    return {
        x: parseInt(match![1]),
        y: parseInt(match![2]),
        dx: parseInt(match![3]),
        dy: parseInt(match![4]),
    }
} 

function getStateAt(input: Input[], time: number) {
    return input.map(i => ({
        x: i.x + i.dx * time,
        y: i.y + i.dy * time
    }));
}

function getHeight(input: Point[]) {
    return Math.max(...input.map(i => i.y)) - Math.min(...input.map(i => i.y)) + 1;
}

function getWidth(input: Point[]) {
    return Math.max(...input.map(i => i.x)) - Math.min(...input.map(i => i.x)) + 1;
}

