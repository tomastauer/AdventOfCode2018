import { Solution } from 'src/utilities/solver';
import { numberRange } from '../../utilities/array';

export default class Day02 implements Solution {
    async solvePart1(input: string[]) {
        const parsedInput = parseInput(input[0]);
        const gameBoard = [] as number[];
        const score = numberRange(0, parsedInput.numberOfPlayer).map(_ => 0);
        let currentIndex = 0;
        let currentPlayer = 1;

        for(let i = 1; i < parsedInput.lastMarble; i++) {
            if(i > 0 && i % 23 === 0) {
                currentIndex = getNextIndex(gameBoard, currentIndex, -9);
                const scoreAddition = gameBoard.splice(currentIndex, 1)[0] + i;
                score[currentPlayer - 1] += scoreAddition;
            } else {
                gameBoard.splice(currentIndex, 0, i);
            }

            currentIndex = getNextIndex(gameBoard, currentIndex, 2);
            currentPlayer = getNextPlayer(currentPlayer, parsedInput.numberOfPlayer);
            if (i % 1000 === 0) {
                console.log(i);
            }
        }
 
        return Math.max(...score);
    }

    async solvePart2(input: string[]) {
        return '';
    }

    
    
}

interface Input {
    numberOfPlayer: number;
    lastMarble: number;
}

function getNextIndex(gameBoard: number[], currentIndex: number, increment: number) {
    return (currentIndex + increment + gameBoard.length) % gameBoard.length;
}

function getNextPlayer(currentPlayer: number, totalPlayers: number) {
    return (currentPlayer % totalPlayers) + 1;
}

function parseInput(input: string) {
    const match = /(\d+) players; last marble is worth (\d+) points/g.exec(input);
    return {
        numberOfPlayer: parseInt(match![1]),
        lastMarble: parseInt(match![2])
    }
} 
