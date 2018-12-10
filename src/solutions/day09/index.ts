import { Solution } from 'src/utilities/solver';
import { numberRange } from '../../utilities/array';

export default class Day02 implements Solution {
    async solvePart1(input: string[]) {
        const parsedInput = parseInput(input[0]);
        const gameBoard = {
            id: 0
        } as Item;
        gameBoard.next = gameBoard;
        gameBoard.prev = gameBoard;
        
        let currentItem = gameBoard;
        let currentPlayer = 1;

        const score = numberRange(0, parsedInput.numberOfPlayer).map(_ => 0);

        for(let i = 1; i < parsedInput.lastMarble; i++) {
            const newItem = {
                id: i,
                prev: currentItem.next,
                next: currentItem.next.next
            };

            if(i > 0 && i % 23 === 0) {
                currentItem = currentItem.prev.prev.prev.prev.prev.prev;
                score[currentPlayer - 1] += currentItem.prev.id + i;
                removeItem(currentItem.prev);
            } else {
                currentItem = newItem;
                currentItem.prev.next = currentItem;
                currentItem.next.prev = currentItem;
            }

            currentPlayer = getNextPlayer(currentPlayer, parsedInput.numberOfPlayer);
        }

        return Math.max(...score);
    }

    async solvePart2(input: string[]) {
        return '';
    }
}

function removeItem(item: Item) {
    item.prev.next = item.next;
    item.next.prev = item.prev;
}

interface Item {
    next: Item;
    prev: Item;
    id: number;
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
