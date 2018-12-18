import { Solution } from 'src/utilities/solver';

export default class Day02 implements Solution {
    async solvePart1(input: string[]) {
        let forest = parseInput(input);
        for(let i = 0; i < 10; i++) {
            forest = live(forest);
        }

        return getResourceValue(forest);
    }

    async solvePart2(input: string[]) {
        let forest = parseInput(input);
        let startOfPeriod = 0;
        let endOfPeriod = 0;
        const memos = [] as string[];
        for(let i = 0; i < 10000; i++) {
            forest = live(forest);
            const stringify = JSON.stringify(forest);
            if(memos.includes(stringify)) {
                startOfPeriod = memos.indexOf(stringify);
                endOfPeriod = i;
                break;
            } else {
                memos.push(stringify);
            }
        }
        const numberOfMinutes = 1000000000;

        const periodLength = endOfPeriod - startOfPeriod;
        const iteration = (numberOfMinutes - startOfPeriod) % periodLength;
        return getResourceValue(JSON.parse(memos[startOfPeriod + iteration - 1]));
    }
}

interface Point {
    x: number;
    y: number;
}

function print(forest: string[][]) {
    const xSize = forest[0].length;
    for(let y = 0; y < forest.length; y++) {
        const line = [];
        for(let x = 0; x < xSize; x++) {
            line.push(forest[y][x]);
        }
        console.log(line.join(''));
    }
}

function getResourceValue(forest: string[][]) {
    let numberOfLumberyards = 0;
    let numberOfWoodedAcres = 0;
    
    for(let y = 0; y < forest.length; y++) {
        numberOfLumberyards += forest[y].filter(f => f === '#').length;
        numberOfWoodedAcres += forest[y].filter(f => f === '|').length;
    }

    return numberOfLumberyards * numberOfWoodedAcres;
}

function live(forest: string[][]) {
    const output = [] as string[][];
    const xSize = forest[0].length;
    for(let y = 0; y < forest.length; y++) {
        output[y] = [];
        for(let x = 0; x < xSize; x++) {
            output[y][x] = determineNextState(forest[y][x], getAdjacentAreas({x, y}, forest).filter(a => a) as string[]);
        }
    }

    return output;
}

function determineNextState(state: string, adjacentStates: string[]) {
    if(state === '.') {
        return adjacentStates.filter(a => a === '|').length >= 3 ? '|' : '.';
    }

    if(state === '|') {
        return adjacentStates.filter(a => a === '#').length >= 3 ? '#' : '|';
    }

    if(state === '#') {
        return (adjacentStates.filter(a => a === '#').length >= 1 && adjacentStates.filter(a => a === '|').length >= 1) ? '#' : '.';
    }

    throw 'not supported';
}


function parseInput(input: string[]) {
    return input.map(i => i.split(''));
}

function getAdjacentAreas(position: Point, forest: string[][]) {
    return [
        getAt(position.x - 1, position.y - 1, forest),
        getAt(position.x - 1, position.y, forest),
        getAt(position.x - 1, position.y + 1, forest),
        getAt(position.x, position.y - 1, forest),
        getAt(position.x, position.y + 1, forest),
        getAt(position.x + 1, position.y - 1, forest),
        getAt(position.x + 1, position.y, forest),
        getAt(position.x + 1, position.y + 1, forest),
    ]
}

function getAt(x: number, y: number, forest: string[][]) {
    if(forest[y] && forest[y][x]) {
        return forest[y][x];
    }

    return null;
}
