import { Solution } from 'src/utilities/solver';

export default class Day02 implements Solution {
    async solvePart1(input: string[]) {
        const parsedInput = parseInput(input);
        const boundRegister = parsedInput[0] as number;
        const instructions = parsedInput[1] as Instruction[];

        let ip = 0;
        const registers = [0, 0, 0, 0, 0, 0];
        const allOperations = getAllOperations();

        while(ip >= 0 && ip < instructions.length) {
            registers[boundRegister] = ip;

            const instruction = instructions[ip];
            allOperations[instruction.method](instruction.argA, instruction.argB, instruction.argC, registers);

            ip = registers[boundRegister];
            ip++;
        }

        return registers[0];
    }

    async solvePart2(input: string[]) {
        const parsedInput = parseInput(input);
        const boundRegister = parsedInput[0] as number;
        const instructions = parsedInput[1] as Instruction[];

        let ip = 0;
        const registers = [1, 0, 0, 0, 0, 0];
        const allOperations = getAllOperations();
        let counter = 0;
        const periodBuffer = [];

        let prevReg = [] as number[];
        while(ip >= 0 && ip < instructions.length) {
            registers[boundRegister] = ip;

            const instruction = instructions[ip];
            allOperations[instruction.method](instruction.argA, instruction.argB, instruction.argC, registers);

            ip = registers[boundRegister];
            periodBuffer.push(`${ip}, ${registers}`);
            
            if(ip === 10) {
                if(!prevReg.length) {
                    prevReg = [...registers];
                }
                if(prevReg[5] === registers[5] - 1) {
                    registers[5] = registers[4] - 1;
                }

                if(prevReg[2] === registers[2] - 1) {
                    registers[2] = registers[4] - 1;
                }
            }

            ip++;
            counter ++;
            
            if(counter > 400) {
                break;
            }
        }
        console.log(periodBuffer.join('\r\n'));

        return registers[0];
    }
}

interface Instruction {
    method: string,
    argA: number,
    argB: number,
    argC: number,
}

function parseInput(input: string[]) {
    const ip = parseInt(/#ip (.*)/.exec(input[0]!)![1]);
    const instructions: Instruction[] = input.slice(1).map(i => {
        const parts = i.split(' ');
        return {
            method: parts[0],
            argA: parseInt(parts[1]),
            argB: parseInt(parts[2]),
            argC: parseInt(parts[3])
        };
    });
    
    return [ip, instructions];
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
    ].reduce((agg, curr) => {
        agg[curr.name] = curr;
        return agg;
    }, {} as {[key: string]: (regA: number, regB: number, result: number, registers: number[]) => void});
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
