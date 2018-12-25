import { Solution } from 'src/utilities/solver';

export default class Day02 implements Solution {
    async solvePart1(input: string[]) {
        const nanobots = parseInput(input).sort((a, b) => b.radius - a.radius);
        const biggest = nanobots[0];

        const matches = nanobots.filter(nanobot => getDistance(nanobot, biggest) <= biggest.radius);
        return matches.length;
    }

    async solvePart2(input: string[]) {
        const nanobots = parseInput(input).sort((a, b) => b.radius - a.radius);
        const approx = nanobots.map(n => ({
            x: Math.round(n.x / 10000000),
            y: Math.round(n.y / 10000000),
            z: Math.round(n.z / 10000000),
            radius: Math.ceil(n.radius / 10000000),
        }));



        let highestCount = 0;
        let buffer = [] as PointWithNanobots[];
        const ratio = 50;

        for (let x = -25; x < 25; x++) {
            for (let y = -25; y < 25; y++) {
                for (let z = -25; z < 25; z++) {
                    const nanobots = approx.filter(a => getDistance(a, {
                        x, y ,z
                    } as Nanobot) <= a.radius);

                    if(nanobots.length > highestCount) {
                        const pointWithNanobots = {
                            point: { x, y, z },
                            nanobots: nanobots
                        };
                        if(nanobots.length === highestCount) {
                            buffer.push(pointWithNanobots);
                        } else {
                            buffer = [pointWithNanobots]
                        }
                        highestCount = nanobots.length;
                    }
                }
            }
        }

        const buffer2 = iterate(nanobots, buffer, 2);
        const buffer3 = iterate(nanobots, buffer2, 3);
        const buffer4 = iterate(nanobots, buffer3, 4);
        const buffer5 = iterate(nanobots, buffer4, 5);
        console.log(buffer2);
        




        //console.log(approx.map(a => `${a.x}, ${a.y}, ${a.z}, ${a.radius}`).join('\r\n'));
        console.log(highestCount);
        return '';
    }
}

function iterate(nanobots: Nanobot[], input: PointWithNanobots[], ratio: number) {
    const power = Math.pow(2, ratio);
    const divisor = 10000000 / power;
    const approx = nanobots.map(n => ({
        x: Math.round(n.x / divisor),
        y: Math.round(n.y / divisor),
        z: Math.round(n.z / divisor),
        radius: Math.ceil(n.radius / divisor),
    }));

    let highestCount = 0;
    let buffer = [] as PointWithNanobots[];

    input.forEach(f => {
        for (let x = f.point.x-1; x < f.point.x + 1; x++) {
            for (let y = f.point.y - 1; y < f.point.y + 1; y++) {
                for (let z = f.point.z - 1; z < f.point.z + 1; z++) {
                    const nanobots = approx.filter(a => getDistance(a, {
                        x, y, z
                    } as Nanobot) <= a.radius);

                    if(nanobots.length > highestCount) {
                        const pointWithNanobots = {
                            point: { x: x * power, y: y * power, z: z * power },
                            nanobots: nanobots
                        };
                        if(nanobots.length === highestCount) {
                            buffer.push(pointWithNanobots);
                        } else {
                            buffer = [pointWithNanobots]
                        }
                        highestCount = nanobots.length;
                    }
                }
            }
        }
    });
    return buffer;
}

interface PointWithNanobots {
    point: Point,
    nanobots: Nanobot[];
}

interface Point {
    x: number;
    y: number;
    z: number;
}

interface Nanobot {
    x: number;
    y: number;
    z: number;
    radius: number;
}

function getDistance(nanobot1: Nanobot, nanobot2: Nanobot) {
    return Math.abs(nanobot1.x - nanobot2.x) + Math.abs(nanobot1.y - nanobot2.y) + Math.abs(nanobot1.z - nanobot2.z);
}

function parseInput(input: string[]) {
    const pattern = /pos=<([-\d]+),([-\d]+),([-\d]+)>, r=(\d+)/;
    return input.map(i => {
        const match = pattern.exec(i)!;
        return {
            x: parseInt(match[1]),
            y: parseInt(match[2]),
            z: parseInt(match[3]),
            radius: parseInt(match[4])
        } as Nanobot;
    })
}
