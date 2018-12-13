import { Solution } from 'src/utilities/solver';

export default class Day02 implements Solution {
    async solvePart1(input: string[]) {
        const parsedInput = parseInput(input);
        const trains = parsedInput[0] as Train[];
        const track = parsedInput[1] as string[][];

        while(!isCrash(trains)) {
            trains.forEach(t => {
                tickTrain(t, track);
            });
        }
        const crashPosition = getCrashPosition(trains) as Point;

        return `${crashPosition.x},${crashPosition.y}`;
    }

    async solvePart2(input: string[]) {
        const parsedInput = parseInput(input);
        let trains = parsedInput[0] as Train[];
        const track = parsedInput[1] as string[][];

        while(trains.length > 1) {
            trains.forEach(t => {
                tickTrain(t, track);
            });

            while(isCrash(trains)) {
                trains = removeCrashedTrains(trains);
            }
        }

        return `${trains[0].position.x},${trains[0].position.y}`;
    }
}

function print(trains: Train[], track: string[][]) {
    for (let y = 0; y < track.length; y++) {
        const line = [];
        for (let x = 0; x < track[y].length; x++) {
            const train = trains.find(
                t => t.position.x === x && t.position.y === y
            );
            if (train) {
                line.push(printTrain(train));
            } else {
                line.push(track[y][x]);
            }
        }
        console.log(line.join(''));
    }
}

function printTrain(train: Train) {
    switch (train.direction) {
        case Direction.Down:
            return 'v';
        case Direction.Left:
            return '<';
        case Direction.Right:
            return '>';
        case Direction.Up:
            return '^';
    }
}

function getCrashPosition(trains: Train[]) {
    const positions = trains.map(t => JSON.stringify(t.position)).sort();
    for(let i = 0; i < positions.length; i++) {
        if(positions[i + 1] === positions[i]) {
            return JSON.parse(positions[i]);
        }
    }
}

function removeCrashedTrains(trains: Train[]) {
    return trains.filter((train) => trains.filter(t => t.position.x === train.position.x && t.position.y === train.position.y).length === 1);
}

function isCrash(trains: Train[]) {
    return new Set<string>(trains.map(t => JSON.stringify(t.position))).size !== trains.length;
}

function parseInput(input: string[]) {
    const track = [];
    const trains = [] as Train[];
    for (let y = 0; y < input.length; y++) {
        track[y] = [] as string[];
        const items = input[y].split('');
        for (let x = 0; x < input[y].length; x++) {
            track[y][x] = replaceTrain(items[x]);
            if (isTrain(items[x])) {
                trains.push(parseTrain(items[x], { x, y }));
            }
        }
    }

    return [trains, track];
}

function replaceTrain(track: string) {
    if (track === '>' || track === '<') {
        return '-';
    }

    if (track === 'v' || track === '^') {
        return '|';
    }

    return track;
}

function isTrain(track: string) {
    return trains.includes(track);
}

function parseTrain(train: string, position: Point) {
    const result = {
        interstection: Movement.GoLeft,
        position
    } as Train;

    switch (train) {
        case '<':
            result.direction = Direction.Left;
            return result;
        case '>':
            result.direction = Direction.Right;
            return result;
        case '^':
            result.direction = Direction.Up;
            return result;
        default:
            result.direction = Direction.Down;
            return result;
    }
}

const trains = ['v', '>', '<', '^'];

enum Direction {
    Up,
    Down,
    Left,
    Right
}

enum Movement {
    GoLeft,
    GoStraight,
    GoRight
}

interface Point {
    x: number;
    y: number;
}

interface Train {
    direction: Direction;
    interstection: Movement;
    position: Point;
}

function tickTrain(train: Train, track: string[][]) {
    const nextPosition = decideNextPosition(train.position, train.direction);
    const nextTrack = track[nextPosition.y][nextPosition.x];
    const nextMovement = getNextMovement(train, nextTrack);
    if (isIntersection(nextTrack)) {
        train.interstection = getNextIntersectionMovement(train);
    }
    train.position = nextPosition;
    train.direction = decideNextDirection(train.direction, nextMovement);
}

const leftRotation = [
    Direction.Up,
    Direction.Left,
    Direction.Down,
    Direction.Right
];
const rightRotation = [
    Direction.Up,
    Direction.Right,
    Direction.Down,
    Direction.Left
];

function decideNextPosition(position: Point, direction: Direction) {
    const newPosition = { ...position };

    switch (direction) {
        case Direction.Up:
            newPosition.y--;
            return newPosition;
        case Direction.Left:
            newPosition.x--;
            return newPosition;
        case Direction.Down:
            newPosition.y++;
            return newPosition;
        default:
            newPosition.x++;
            return newPosition;
    }
}

function decideNextDirection(direction: Direction, movement: Movement) {
    switch (movement) {
        case Movement.GoLeft:
            return leftRotation[(leftRotation.indexOf(direction) + 1) % 4];
        case Movement.GoRight:
            return rightRotation[(rightRotation.indexOf(direction) + 1) % 4];
        default:
            return direction;
    }
}

function getNextMovement(train: Train, nextTrack: string) {
    if (isStraight(nextTrack)) {
        return Movement.GoStraight;
    }

    if (isTurnLeft(train.direction, nextTrack)) {
        return Movement.GoLeft;
    }

    if (isTurnRight(train.direction, nextTrack)) {
        return Movement.GoRight;
    }

    if (isIntersection(nextTrack)) {
        return train.interstection;
    }

    throw 'Not supported track';
}

function getNextIntersectionMovement(train: Train) {
    switch (train.interstection) {
        case Movement.GoLeft:
            return Movement.GoStraight;
        case Movement.GoStraight:
            return Movement.GoRight;
        default:
            return Movement.GoLeft;
    }
}

function isStraight(nextTrack: string) {
    return nextTrack === '|' || nextTrack === '-';
}

function isTurnLeft(direction: Direction, nextTrack: string) {
    if (nextTrack !== '/' && nextTrack !== '\\') {
        return false;
    }

    if (nextTrack === '/') {
        return [Direction.Left, Direction.Right].includes(direction);
    } else {
        return [Direction.Up, Direction.Down].includes(direction);
    }
}

function isTurnRight(direction: Direction, nextTrack: string) {
    if (nextTrack !== '/' && nextTrack !== '\\') {
        return false;
    }

    if (nextTrack === '\\') {
        return [Direction.Left, Direction.Right].includes(direction);
    } else {
        return [Direction.Up, Direction.Down].includes(direction);
    }
}

function isIntersection(nextTrack: string) {
    return nextTrack === '+';
}
