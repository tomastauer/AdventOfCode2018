import { Solution } from '../../utilities/solver';

export default class Day02 implements Solution {
    async solvePart1(input: string[]) {
        const parsed = parseInput(input);
        const playground = parsed[0] as string[][];
        let players = parsed[1] as Player[];
        let counter = 1;

        while (canPlay(players)) {
            console.log('roundStart', counter);
            print(playground, players);
            console.log('');

            players.sort((a, b) => a.position.y - b.position.y || a.position.x - b.position.x);
            let completeRun = true;
            for(let i = 0; i < players.length; i++) {
                if(!canPlay(players)) {
                    completeRun = false;
                }

                const player = players[i];
                if (!canAttack(player, players, playground)) {
                    const distanceMap = computeDistanceMap(
                        player.position,
                        players,
                        playground,
                    );
                    if(canMove(player, players, distanceMap)) {
                        const moveTarget = getMoveTarget(player, players, playground, distanceMap) as any;
                        const nextMovement = moveTarget.d == 1 ? moveTarget : determineNextMovement(distanceMap, player.position, moveTarget, players, playground);
                        if(nextMovement) {
                            player.position = { x: nextMovement.x, y: nextMovement. y };
                        }
                    } 
                }
            
                if (canAttack(player, players, playground)) {
                    const target = getAttackTarget(player, players, playground) as Player;
                    target.hp -= 3;
                    if(target.hp <= 0) {
                        const index = players.indexOf(target);
                        players.splice(index, 1);
                        if(index < i) {
                            i--;
                        }
                    }
                }
            }
            
            print(playground, players);
            console.log(players);
            console.log('roundEnd', counter);
            
            if(completeRun) {
                counter++;
            }
            if(counter > 5) {break;}
            console.log('');
        }
        print(playground, players);
        console.log(players);
        return getRemainingHitpoins(players) * (counter - 1);
        // 236583
        // 296799
    }

    async solvePart2(input: string[]) {
        return '';
    }
}

interface Player {
    type: string;
    hp: number;
    position: Point;
}

interface Point {
    x: number;
    y: number;
}

interface Distance {
    point: Point;
    d: number;
}

function getRemainingHitpoins(players: Player[]) {
    return players.map(player => player.hp).reduce((agg, curr) => agg + curr, 0);
}

function canPlay(players: Player[]) {
    return players.filter(p => p.type === players[0].type).length !== players.length;
}

function parseInput(input: string[]) {
    const sizeY = input.length;
    const sizeX = input[0].length;
    const players = [] as Player[];
    const playground = [] as string[][];
    for (let y = 0; y < sizeY; y++) {
        const line = input[y].split('');
        playground[y] = [];
        for (let x = 0; x < sizeX; x++) {
            playground[y][x] = line[x] === '#' ? '#' : '.';
            if (line[x] === 'G' || line[x] === 'E') {
                players.push({
                    type: line[x],
                    hp: 200,
                    position: { x, y },
                });
            }
        }
    }

    return [playground, players];
}

function print(playground: string[][], players: Player[]) {
    const sizeX = playground[0].length;
    for (let y = 0; y < playground.length; y++) {
        const line = [];
        for (let x = 0; x < sizeX; x++) {
            const player = players.find(
                p => p.position.x === x && p.position.y === y,
            );
            line.push(player ? player.type : playground[y][x]);
        }
        console.log(line.join(''));
    }
}

function canMove(player: Player, players: Player[], distanceMap: any[][]) {
    return players
        .filter(p => p.type !== player.type)
        .some(p => {
            const distance = distanceMap[p.position.y][p.position.x];
            return distance !== '0' && distance !== '.';
        });
}

function canAttack(player: Player, players: Player[], playground: string[][]) {
    return getAttackTargets(player, players, playground).length > 0;
}

function getAttackTarget(
    player: Player,
    players: Player[],
    playground: string[][],
) {
    const deadest = getNearest(getDeadests(
        getAttackTargets(player, players, playground)
    ).map(c => c.position));
    return players.find(
        p => p.position.x === deadest.x && p.position.y === deadest.y,
    );
}

function determineNextMovement(
    sourceDistanceMap: any[][],
    source: Point,
    target: Point,
    players: Player[],
    playground: string[][],
) {
    const fromTarget = computeDistanceMap(target, players, playground);
    const adjacent = getAdjacentPoints(source, playground).map(p => ({
        ...p,
        d: (parseInt(fromTarget[p.y][p.x]) || 99) + (parseInt(sourceDistanceMap[p.y][p.x]) || 99),
    }));
    const sorted = adjacent.sort((a, b) => a.d - b.d);
    return getNearest(sorted.filter(s => s.d === sorted[0].d));
}

function getAttackTargets(
    player: Player,
    players: Player[],
    playground: string[][],
) {
    const adjacent = getAdjacentPoints(player.position, playground);
    return players.filter(p => p.type !== player.type && p.hp > 0).filter(p =>
        adjacent.some(a => p.position.x === a.x && p.position.y === a.y),
    );
}

function getMoveTarget(
    player: Player,
    players: Player[],
    playground: string[][],
    distanceMap: any[][],
) {
    const candidates = ([] as Point[]).concat(
        ...players
            .filter(p => p !== player && p.type !== player.type)
            .map(p => getAdjacentPoints(p.position, playground)
            .filter(pos => !players.some(p => p.position.x === pos.x && p.position.y === pos.y)))
    );
    const distances = candidates
        .map(c => ({ ...c, d: distanceMap[c.y][c.x] }))
        .filter(d => d.d !== '.')
        .sort((a, b) => a.d - b.d);
    const lowestDistances = distances.filter(d => d.d === distances[0].d);
    return getNearest(lowestDistances);
}

function getNearest(points: Point[]) {
    return points
        .map(p => p)
        .sort((a, b) => a.y - b.y || a.x - b.x)[0];
}

function getDeadests(players: Player[]) {
    const sorted = players
        .map(p => p)
        .sort((a, b) => a.hp - b.hp);

    return sorted.filter(s => s.hp === sorted[0].hp);
}

function isPlayer(players: Player[], position: Point) {
    return players.some(
        player =>
            player.position.x === position.x &&
            player.position.y === position.y,
    );
}

function computeDistanceMap(
    position: Point,
    players: Player[],
    playground: string[][],
) {
    let adjacent = [] as Distance[];
    const distanceMap = JSON.parse(JSON.stringify(playground)) as any[][];
    distanceMap[position.y][position.x] = 0;
    adjacent.push(
        ...getAdjacentPoints(position, playground)
            .filter(pos => !isPlayer(players, pos))
            .map(pos => ({
                point: pos,
                d: 1,
            })),
    );
    const resolvedPoints = new Set<string>();
    resolvedPoints.add(JSON.stringify(position));
    while (adjacent.length) {
        const current = adjacent.shift()!;
        resolvedPoints.add(JSON.stringify(current.point));
        distanceMap[current.point.y][current.point.x] = current.d.toString();
        if (!isPlayer(players, current.point)) {
            adjacent.push(
                ...getAdjacentPoints(current.point, playground)
                    .filter(a => !resolvedPoints.has(JSON.stringify(a)))
                    .map(pos => ({ point: pos, d: current.d + 1 })),
            );
        }
        adjacent = adjacent.filter(a => !resolvedPoints.has(JSON.stringify(a.point)));
    }

    return distanceMap;
}

function getAdjacentPoints(position: Point, playground: string[][]) {
    return [
        { x: position.x - 1, y: position.y },
        { x: position.x + 1, y: position.y },
        { x: position.x, y: position.y - 1 },
        { x: position.x, y: position.y + 1 },
    ].filter(pos => playground[pos.y][pos.x] !== '#');
}
