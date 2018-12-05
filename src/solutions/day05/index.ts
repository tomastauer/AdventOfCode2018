import { Solution } from 'src/utilities/solver';

export default class Day02 implements Solution {
    async solvePart1(input: string[]) {
        let inputLine = input[0];
        let prevLength = inputLine.length;

        while(true) {
            inputLine = iterate(inputLine);
            if(inputLine.length !== prevLength) {
                prevLength = inputLine.length;
            } else {
                break;
            }
        }
        return inputLine.length;
    }

    async solvePart2(input: string[]) {
        const alphabet = 'abcdefghijklmnopqrstuvwxyz';
        const result = alphabet.split('').reduce((agg, curr) => {
            const regex = new RegExp(`${curr}`, 'gi');
            let inputLine = input[0].replace(regex, '');
            let prevLength = inputLine.length;
        
            while(true) {
                inputLine = iterate(inputLine);
                if(inputLine.length !== prevLength) {
                    prevLength = inputLine.length;
                } else {
                    break;
                }
            }

            agg[curr] = inputLine.length;
            return agg;
        }, {} as {[key: string]: number})
        
        return Math.min(...Object.values(result));
    }
}

function iterate(input: string) {
    let removed = false;
    return input.split('').reduce((agg, curr, index, array) => {
        if(removed) {
            removed = false;
            return agg;
        }
     
        if(index == input.length - 1) {
            agg.push(curr);
            return agg;
        }

        if((curr === array[index + 1].toLowerCase() || curr === array[index + 1].toUpperCase()) && curr !== array[index + 1]) {
            removed = true;
            return agg;
        }

        agg.push(curr);
        return agg;
    }, [] as string[]).join('');
}
