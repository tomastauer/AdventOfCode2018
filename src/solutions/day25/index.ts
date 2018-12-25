import { Solution } from 'src/utilities/solver';

export default class Day02 implements Solution {
    async solvePart1(input: string[]) {
        let points = parseInput(input);

        const constellations: Constelation[] = [];
        while(points.length) {
            const first = points.shift()!;
            const constellation: Constelation = {
                points: [first]
            };

            let within: Point[] = [];
            do {
                within = [];
                for(let i = 0; i < points.length; i++) {
                    if(isWithinConstellation(constellation, points[i])) {
                        within.push(points[i]);
                    }
                }

                within.forEach(w => {
                    constellation.points.push(w);
                    points.splice(points.indexOf(w), 1);
                })
            } while(within.length);

            constellations.push(constellation);
        }

        return constellations.length;
    }

    async solvePart2(input: string[]) {
        return '';
    }
}

interface Point {
    x: number;
    y: number;
    z: number;
    t: number;
}

interface Constelation {
    points: Point[];
}

function isWithinConstellation(constellation: Constelation, point: Point) {
    return constellation.points.some(p => getDistance(p, point) <= 3);
}

function getDistance(point1: Point, point2: Point) {
    return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y) + Math.abs(point1.z - point2.z) + Math.abs(point1.t - point2.t);
}

function parseInput(input: string[]) {
    return input.map(i => {
        const p = i.split(',').map(c => parseInt(c));
        return {
            x: p[0],
            y: p[1],
            z: p[2],
            t: p[3]
        } as Point;
    })
}
