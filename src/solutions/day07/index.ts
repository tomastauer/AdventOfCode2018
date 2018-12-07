import { Solution } from 'src/utilities/solver';
import { areAllItemsSame, groupBy, findMostOftenItem } from '../../utilities/array';

export default class Day02 implements Solution {
    async solvePart1(input: string[]) {
        const instructions = parseInput(input);
        const result = [];
        while(!isFinished(instructions)) {
            result.push(interate(instructions));
        }
        return result.join('');
    }

    async solvePart2(input: string[]) {
        return '';
    }
}

interface Instructions {
    [key: string]: Instruction;
}

interface Instruction {
    prereqs: Set<string>;
    code: string;
    followedBy: Set<string>
}

function interate(instructions: Instructions) {
    const toExecute = Object.values(instructions).filter(i => i.prereqs.size === 0)[0];
    delete instructions[toExecute.code];
    toExecute.followedBy.forEach(post => {
        instructions[post].prereqs.delete(toExecute.code);
    });

    return toExecute.code;
}

function isFinished(instructions: Instructions) {
    return !Object.keys(instructions).length;
}

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function parseInput(input: string[]) {
    const instructions = alphabet.split('').reduce((agg, curr) => {
        initializeInstruction(agg, curr);
        return agg;
    }, {} as Instructions);

    const pattern = /Step (\w) must be finished before step (\w) can begin\./;
    return input.map(i => pattern.exec(i)).filter(i => i).reduce((agg, curr) => {
        const pre = curr![1];
        const post = curr![2];
        agg[pre].followedBy.add(post);
        agg[post].prereqs.add(pre);
        return agg;
    }, instructions);
}

function initializeInstruction(instructions: Instructions, code: string) {
    instructions[code] = {
        prereqs: new Set<string>(),
        code,
        followedBy: new Set<string>()
    };
}