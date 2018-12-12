import { Solution } from 'src/utilities/solver';
import { numberRange } from '../../utilities/array';
import { format } from 'path';

export default class Day02 implements Solution {
    async solvePart1(input: string[]) {
        const serialNumber = parseInt(input[0]);
        const playground = buildPlayground(serialNumber);

        let maxLevel = 0;
        let maxPoint = {} as Point;

        for(let y = 0; y < 298; y++) {
            for(let x = 0; x < 298; x++) {
                const currentPoint = {
                    x, y
                };
                const level = getPowerLevels(playground, currentPoint);

                if(level > maxLevel) {
                    maxLevel = level;
                    maxPoint = currentPoint;
                }
            }
        }

        return `${maxPoint.x},${maxPoint.y}`;
    }

    async solvePart2(input: string[]) {
        const serialNumber = parseInt(input[0]);
        const playground = buildPlayground(serialNumber);

        let maxLevel = -9999999999;
        let maxSize = 0;
        let maxPoint = {} as Point;

        for(let y = 0; y < 300; y++) {
            for(let x = 0; x < 300; x++) {
                const currentPoint = {
                    x, y
                };
                const level = getPowerLevelsDynamic(playground, currentPoint);

                if(level[0] > maxLevel) {
                    maxLevel = level[0];
                    maxSize = level[1]
                    maxPoint = currentPoint;
                }
            }
        }

        return `${maxPoint.x},${maxPoint.y},${maxSize}`;
    }
}

function buildPlayground(serialNumber: number) {
    const playground = initializePlayground(300);

    for (let x = 0; x < 300; x++) {
        for (let y = 0; y < 300; y++) {
            const rackId = x + 10;
            playground[y][x] = getHundreds((rackId * y + serialNumber) * rackId) - 5;
        }
    }

    return playground;
}

interface Point {
    x: number;
    y: number;
}

function getPowerLevels(playground: number[][], center: Point) {
    return (([] as number[]).concat(...numberRange(0, 3).map(y => numberRange(0, 3).map(x => playground[center.y + y][center.x + x])))).reduce((agg, curr) => agg + curr, 0);
}

function getPowerLevelsDynamic(playground: number[][], center: Point) {
    let powerLevels = [];
    let memo = 0;
    for(let size = 1; size < 300 - Math.max(center.x, center.y); size++) {
        let currentAddition = 0;
        for (let d = 0; d < size; d++) {
            currentAddition += playground[center.y + size-1][center.x + d] + playground[center.y + d][center.x + size-1];
        }

        currentAddition -= playground[size-1][size-1];
        memo += currentAddition;
        powerLevels.push(memo);
    }
    const maxPowerLevel = Math.max(...powerLevels);
    return [maxPowerLevel, powerLevels.indexOf(maxPowerLevel) + 1];
}

function initializePlayground(canvasSize: number) {
    return Array.from({length:canvasSize}, () => Array.from({length:canvasSize}, () => 0));
}

function getHundreds(input: number) {
    return Math.trunc((input % 1000) / 100);
}
