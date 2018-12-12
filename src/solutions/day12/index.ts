import { Solution } from 'src/utilities/solver';

export default class Day02 implements Solution {
    async solvePart1(input: string[]) {
        const zeroGen = getInitialState(input[0]);
        const rules = parseRules(input.slice(2));

        const generations = [zeroGen];

        for (let g = 1; g <= 20; g++) {
            generations.push(live(generations[generations.length - 1], rules));
        }

        return getPositionsInGeneration(generations[generations.length - 1]);
    }

    async solvePart2(input: string[]) {
        const zeroGen = getInitialState(input[0]);
        const rules = parseRules(input.slice(2));

        const generations = [zeroGen];
        let stable = false;

        while(!stable) {
            const prevGen = generations[generations.length - 1];
            const nextGen = live(prevGen, rules);
            generations.push(nextGen);
            stable = isStable(prevGen, nextGen);
        }

        const increment = getIncrement(generations);
        const genNo = generations.length - 1;
        const lastGen = generations[generations.length - 1];
        const numberOfPlants = lastGen.split('').filter(c => c === '#').length;

        return getPositionsInGeneration(lastGen) + numberOfPlants * increment * (50000000000-genNo);
    }
}

const initialSpan = 1000;

function live(state: string, rules: Rule[]) {
    const result = [];
    for (let i = 0; i <= state.length - 5; i++) {
        result.push(getNext(state.substring(i, i + 5), rules));
    }
    return wrap(result.join(''), 2);
}

function getInitialState(input: string) {
    const parsed = /initial state: ([\.#]+)/.exec(input);

    return wrap(parsed![1], initialSpan);
}

function parseRules(input: string[]) {
    return input
        .map(i => /([\.#]{5}) => (\.|#)/.exec(i)!)
        .map(match => ({
            pattern: match[1],
            result: match[2],
        }));
}

function wrap(input: string, length: number) {
    return [
        ...Array.from({ length }, () => '.'),
        ...input.split(''),
        ...Array.from({ length }, () => '.'),
    ].join('');
}

function getNext(pattern: string, rules: Rule[]) {
    const rule = rules.find(r => r.pattern === pattern);
    return rule ? rule.result : '.';
}

function getPositionsInGeneration(generation: string) {
    return generation.split('').reduce((a, c, i) => {
        if (c === '#') {
            a += i - initialSpan;
        }
        return a;
    }, 0);
}

function isStable(genA: string, genB: string) {
    const firstPlantA = genA.indexOf('#');
    const lastPlantA = genA.lastIndexOf('#');
    const firstPlantB = genB.indexOf('#');
    const lastPlantB = genB.lastIndexOf('#');

    if (lastPlantA - firstPlantA !== lastPlantB - firstPlantB) {
        return false;
    }

    const aAligned = genA.substring(firstPlantA, lastPlantA + 1);
    const bAligned = genB.substring(firstPlantB, lastPlantB + 1);

    return aAligned === bAligned;
}

function getIncrement(generations: string[]) {
    const lastGen = generations[generations.length - 1];
    const prevGen = generations[generations.length - 2];

    return lastGen.indexOf('#') - prevGen.indexOf('#');
}

interface Rule {
    pattern: string;
    result: string;
}
