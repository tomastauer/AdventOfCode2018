import { Solution } from 'src/utilities/solver';


export default class Day01 implements Solution {
    async solvePart1(input: string[]) {
        return input.reduce((agg, curr) => agg + parseInt(curr), 0).toString();
    }

    async solvePart2(input: string[]) {
        const set = new Set<number>();
        const numberInputs = input.map(i => parseInt(i));
        let foundDuplicity = false;
        let currentFrequency = 0;

        while(!foundDuplicity) {
            currentFrequency = numberInputs.reduce((agg, curr, _, arr) => {
                const newFrequency = agg + curr;
                if(set.has(newFrequency)) {
                    arr.splice(1);
                    foundDuplicity = true;
                }
                set.add(newFrequency);
                return newFrequency;
            }, currentFrequency);
        }

        return currentFrequency.toString();
    }
}