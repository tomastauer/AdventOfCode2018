import { Solution } from 'src/utilities/solver';
import { groupBy } from '../../utilities/array';

export default class Day02 implements Solution {
    async solvePart1(input: string[]) {
        const occurences = input.reduce((agg, curr) => {
            const lengths = Object.entries(groupBy(curr.split(''), i => i)).map(e => (e[1] as []).length) as number[];
            agg[0] += lengths.some(l => l === 2) ? 1 : 0;
            agg[1] += lengths.some(l => l === 3) ? 1 : 0;
            return agg;
        }, [0, 0]);

        return occurences[0] * occurences[1];
    }

    async solvePart2(input: string[]) {
        const rowLength = input[0].length;
        for (let i = 0; i<rowLength; i++) {
            const duplicities = Object.entries(groupBy(input.map(c => c.slice(0, i) + c.slice(i+1, c.length)), c => c)).filter(e => (e[1] as []).length as number === 2);
            if(duplicities.length) {
                return duplicities[0][0];
            }
        }

        return "";
    }
}