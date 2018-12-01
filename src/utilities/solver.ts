import fs from 'fs';
import {promisify} from 'util';

export async function solve(day: number) {
    const folder = `solutions/day${("0" + day).slice(-2)}`;
    const readAsync = promisify(fs.readFile);
    const input = (await readAsync(`./src/${folder}/input.txt`, 'utf8')).split('\r\n');
    const solution = await getDefaultImport(`../${folder}`)

    return [await solution.solvePart1(input), await solution.solvePart2(input)];
}

export interface Solution {
    solvePart1: (input: string[]) => Promise<string>;
    solvePart2: (input: string[]) => Promise<string>;
}

async function getDefaultImport(path: string) {
    return new Promise<Solution>(resolve => {
        import(path).then(m => {
            resolve(new m.default());
        });
    })
}