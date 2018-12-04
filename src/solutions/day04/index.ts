import { Solution } from 'src/utilities/solver';
import { numberRange, groupBy, getMaxKey, findMostOftenItem } from '../../utilities/array';

export default class Day02 implements Solution {
    async solvePart1(input: string[]) {
        let currentGuardId = 0;

        const actions = input.map(parseLine).sort((a, b) => a.date.getTime() - b.date.getTime()).map(action => {
            if(action.guardAction.action === Action.startShift) {
                currentGuardId = action.guardAction.guardId;
                return action;
            }

            action.guardAction.guardId = currentGuardId;
            return action;
        });

        let startMinute = 0;

        const times = actions.reduce((agg, curr) => {
            if(curr.guardAction.action === Action.fallAsleep) {
                startMinute = curr.date.getMinutes();
            }

            if(curr.guardAction.action === Action.wakesUp) {
                fillMinutes(agg, curr.guardAction.guardId, startMinute, curr.date.getMinutes())
            }

            return agg;
        }, {}) as GuardTimes;

        const sleepLengths = groupBy(Object.entries(times), e => (e[1] as any).length);
        const longestSleep = getMaxKey(sleepLengths);
        const mostSleepyGuardId = parseInt(sleepLengths[longestSleep][0][0]);
        const sleepTimes = groupBy(Object.values(groupBy(times[mostSleepyGuardId], e => e)), e => e.length);
        const bestTimeToNap = sleepTimes[getMaxKey(sleepTimes)][0][0];

        return mostSleepyGuardId * bestTimeToNap;
    }

    async solvePart2(input: string[]) {
        let currentGuardId = 0;

        const actions = input.map(parseLine).sort((a, b) => a.date.getTime() - b.date.getTime()).map(action => {
            if(action.guardAction.action === Action.startShift) {
                currentGuardId = action.guardAction.guardId;
                return action;
            }

            action.guardAction.guardId = currentGuardId;
            return action;
        });

        let startMinute = 0;

        const times = actions.reduce((agg, curr) => {
            if(curr.guardAction.action === Action.fallAsleep) {
                startMinute = curr.date.getMinutes();
            }

            if(curr.guardAction.action === Action.wakesUp) {
                fillMinutes(agg, curr.guardAction.guardId, startMinute, curr.date.getMinutes())
            }

            return agg;
        }, {}) as GuardTimes;

        const bestTimesToNap = Object.entries(times).map(entry => {
            return {
                guardId: entry[0],
                bestTimeToNap: findMostOftenItem(entry[1])
            }
        })

        const highestOccurrence = Math.max(...bestTimesToNap.map(t => t.bestTimeToNap.occurrences));
        const mostSleepyGuard = bestTimesToNap.find(b => b.bestTimeToNap.occurrences === highestOccurrence)!;

        return parseInt(mostSleepyGuard.guardId) * (mostSleepyGuard.bestTimeToNap.item as number);
    }
}

interface GuardTimes {
    [ key: number ]: number[]
}

interface Entry {
    guardAction: GuardAction;
    date: Date;
}

const enum Action {
    startShift,
    wakesUp,
    fallAsleep
}

interface GuardAction {
    guardId: number;
    action: Action;
}

function parseLine(line: string) {
    const datePattern = /\[(\d{4}\-\d{2}\-\d{2} \d{2}:\d{2})\]/;
    const date = new Date(datePattern.exec(line)![1]);

    return {
        date,
        guardAction: getAction(line)
    };
}

function getAction(line: string) {
    const guardIdPattern = /#(\d+)/;
    if(line.includes('wakes up')) {
        return {
            guardId: 0,
            action: Action.wakesUp
        };
    }

    if(line.includes('falls asleep')) {
        return {
            guardId: 0,
            action: Action.fallAsleep
        };
    }

    return {
        guardId: parseInt(guardIdPattern.exec(line)![1], 10),
        action: Action.startShift
    } 
}

function fillMinutes(times: GuardTimes, guardId: number, startMinute: number, endMinute: number) {
    if(!times[guardId]) {
        times[guardId] = [];
    }

    times[guardId].push(...numberRange(startMinute, endMinute - startMinute));
}