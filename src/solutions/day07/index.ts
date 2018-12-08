import { Solution } from 'src/utilities/solver';
import { areAllItemsSame, groupBy, findMostOftenItem, numberRange } from '../../utilities/array';

export default class Day02 implements Solution {
    async solvePart1(input: string[]) {
        const instructions = parseInput(input);
        const result = [];
        while(!isFinished(instructions)) {
            result.push(iterate(instructions));
        }
        return result.join('');
    }

    async solvePart2(input: string[]) {
        let time = 0;
        const fixed = 60;
        const instructions = parseInput(input);
        const workers = initializeWorkers(5);
        while(!isFinished(instructions)) {
            workers.filter(w => w.finishAt === time).forEach(worker => {
                worker.isBusy = false;
                finishWork(instructions, worker.instruction!);
            });

            workers.filter(w => !w.isBusy).forEach(w => {
                const someWork = getSomeWork(instructions);
                if(someWork) {
                    someWork.hasWorker = true;
                    w.instruction = someWork;
                    w.isBusy = true;
                    w.finishAt = time + fixed + someWork.code.charCodeAt(0) - 64;
                }
            });
            time++;
        }

        return time-1;
    }
}

function initializeWorkers(numberOfWorkers: number) {
    return numberRange(0, numberOfWorkers).map(index => ({
        id: index,
        isBusy: false,
        finishAt: -1
    } as Worker));
}

interface Worker {
    id: number;
    isBusy: boolean;
    instruction?: Instruction;
    finishAt: number;
}

interface Instructions {
    [key: string]: Instruction;
}

interface Instruction {
    prereqs: Set<string>;
    code: string;
    followedBy: Set<string>;
    active: boolean;
    hasWorker: boolean;
}

function iterate(instructions: Instructions) {
    const toExecute = Object.values(instructions).filter(i => i.prereqs.size === 0)[0];
    delete instructions[toExecute.code];
    toExecute.followedBy.forEach(post => {
        instructions[post].prereqs.delete(toExecute.code);
    });

    return toExecute.code;
}

function getSomeWork(instructions: Instructions) {
    const availableTasks = Object.values(instructions).filter(i => i.prereqs.size === 0 && !i.hasWorker);
    if(!availableTasks.length) {
        return null;
    }

    return availableTasks[0];
}

function finishWork(instructions: Instructions, finishedInstuction: Instruction) {
    finishedInstuction.followedBy.forEach(post => {
        instructions[post].prereqs.delete(finishedInstuction.code);
    });
    delete instructions[finishedInstuction.code];
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
        followedBy: new Set<string>(),
        active: false,
        hasWorker: false
    };
}