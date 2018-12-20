import { Solution } from '../../utilities/solver';
import { groupBy } from '../../utilities/array';

export default class Day02 implements Solution {
    async solvePart1(input: string[]) {
        const parsedInput = parseInput(input);
        const grouped = groupBy(parsedInput[0] as Instruction[], i => i.op[0]);
        
        const candidates = ([] as string[][]).concat(...Object.keys(grouped).map(key => {
            return grouped[key].map(i => getAllValidOperations(i.op[1], i.op[2], i.op[3], i.before, i.after));
        }));

        return candidates.filter(c => c.length >= 3).length;
    }

    async solvePart2(input: string[]) {
        const parsedInput = parseInput(input);
        const grouped = groupBy(parsedInput[0] as Instruction[], i => i.op[0]);
        
        const candidates = Object.keys(grouped).map(key => {
            const validOperations = grouped[key].map(i => getAllValidOperations(i.op[1], i.op[2], i.op[3], i.before, i.after));
            const filtered = validOperations[0].filter(op => validOperations.every(vo => vo.includes(op)));
            return { opCode: key, ops: filtered };
        });

        const instructions: { [key: number]: string} = {};

        for(let i = 0; i < 16; i++) {
            const unique = candidates.find(c => c.ops.length === 1)!;
            const op = unique.ops[0];
            instructions[unique.opCode as any] = op;
            candidates.forEach(c => {
                c.ops = c.ops.filter(cop => cop !== op);
            });
        }

        const register = [0, 0, 0, 0];
        const allOps = getAllOperations();
        (parsedInput[1] as number[][]).forEach(run => {
            const op = allOps.find(o => o.name === instructions[run[0]])!;
            op(run[1], run[2], run[3], register);
        })

        return register[0];
    }
}

interface Instruction {
    before: number[],
    op: number[],
    after: number[]
}

function parseInput(input: string[]) {
    const wholeInput = input.join('\r\n');
    const parts = wholeInput.split('\r\n\r\n\r\n\r\n');
    const definedInstructions = parts[0].split('\r\n');
    const tests = parts[1].split('\r\n');

    const instructions = [] as Instruction[];
    for(let instruction = 0; instruction < definedInstructions.length / 4; instruction++) {
        instructions.push({
            before: JSON.parse(/Before: (.*)/.exec(definedInstructions[4 * instruction])![1]),
            op: definedInstructions[4 * instruction + 1].split(' ').map(s => parseInt(s)),
            after: JSON.parse(/After: (.*)/.exec(definedInstructions[4 * instruction + 2])![1]),
        });
    }

    return [instructions, tests.map(t => t.split(' ').map(t => parseInt(t)))];
}

function getAllValidOperations(argA: number, argB: number, argC: number, registers: number[], expectedRegisters: number[]) {
    return getAllOperations().map(op => {
        const reg = [...registers];
        op(argA, argB, argC, reg);
        return ({ name: op.name, registers: reg });
    }).filter(r => JSON.stringify(r.registers) === JSON.stringify(expectedRegisters)).map(op => op.name);
}

function getAllOperations() {
    return [
        addr,
        addi,
        mulr,
        muli,
        banr,
        bani,
        borr,
        bori,
        setr,
        seti,
        gtir,
        gtri,
        gtrr,
        eqri,
        eqir,
        eqrr
    ];
}

function addr(regA: number, regB: number, result: number, registers: number[]) {
    registers[result] = registers[regA] + registers[regB];
}

function addi(regA: number, valueB: number, result: number, registers: number[]) {
    registers[result] = registers[regA] + valueB;
}

function mulr(regA: number, regB: number, result: number, registers: number[]) {
    registers[result] = registers[regA] * registers[regB];
}

function muli(regA: number, valueB: number, result: number, registers: number[]) {
    registers[result] = registers[regA] * valueB;
}

function banr(regA: number, regB: number, result: number, registers: number[]) {
    registers[result] = registers[regA] & registers[regB];
}

function bani(regA: number, valueB: number, result: number, registers: number[]) {
    registers[result] = registers[regA] & valueB;
}

function borr(regA: number, regB: number, result: number, registers: number[]) {
    registers[result] = registers[regA] | registers[regB];
}

function bori(regA: number, valueB: number, result: number, registers: number[]) {
    registers[result] = registers[regA] | valueB;
}

function setr(regA: number, _: number, result: number, registers: number[]) {
    registers[result] = registers[regA];
}

function seti(valueA: number, _: number, result: number, registers: number[]) {
    registers[result] = valueA;
}

function gtir(valueA: number, regB: number, result: number, registers: number[]) {
    registers[result] = valueA > registers[regB] ? 1 : 0;
}

function gtri(regA: number, valueB: number, result: number, registers: number[]) {
    registers[result] = registers[regA] > valueB ? 1 : 0;
}

function gtrr(regA: number, regB: number, result: number, registers: number[]) {
    registers[result] = registers[regA] > registers[regB] ? 1 : 0;
}

function eqir(valueA: number, regB: number, result: number, registers: number[]) {
    registers[result] = valueA === registers[regB] ? 1 : 0;
}

function eqri(regA: number, valueB: number, result: number, registers: number[]) {
    registers[result] = registers[regA] === valueB ? 1 : 0;
}

function eqrr(regA: number, regB: number, result: number, registers: number[]) {
    registers[result] = registers[regA] === registers[regB] ? 1 : 0;
}

