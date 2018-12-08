import { Solution } from 'src/utilities/solver';
import { sum } from '../../utilities/array';

export default class Day02 implements Solution {
    async solvePart1(input: string[]) {
        const parsed = parseInput(input[0].split(' ').map(i => parseInt(i, 10)), 0);
        return sum(traverseForMetadata(parsed));
    }

    async solvePart2(input: string[]) {
        const parsed = parseInput(input[0].split(' ').map(i => parseInt(i, 10)), 0);
        return sum(traverseForMetadataChildren(parsed));
    }
}

interface Node {
    startsAt: number;
    endsAt: number;
    numberOfChildren: number;
    numberOfMetadataEntries: number;
    children: Node[];
    metadataEntries: number[];
}

function traverseForMetadata(node: Node): number[] {
    return ([] as number[]).concat.apply(node.metadataEntries, node.children.map(traverseForMetadata));
}

function traverseForMetadataChildren(node: Node): number[] {
    const children = getValidChildren(node);
    if(!node.children.length) {
        return node.metadataEntries;
    }
    return ([] as number[]).concat.apply([], children.map(traverseForMetadataChildren));
}

function parseInput(input: number[], index: number) {
    const numberOfChildren = input[index];
    const numberOfMetadataEntries = input[index + 1]

    const node = {
        numberOfChildren,
        numberOfMetadataEntries,
        children: [],
        metadataEntries: [],
        startsAt: index,
        endsAt: 0
    } as Node;

    while(node.children.length !== numberOfChildren) {
        node.children.push(parseInput(input, getLastChildrenEnd(node)));
    }

    const lastChildrenEnd = getLastChildrenEnd(node);

    for(let i = 0; i < numberOfMetadataEntries; i++) {
        node.metadataEntries.push(input[lastChildrenEnd + i]);
    }

    node.endsAt = lastChildrenEnd + numberOfMetadataEntries;
    return node;
}

function getLastChildrenEnd(node: Node) {
    if(!node.children.length) {
        return node.startsAt + 2;
    }

    return node.children[node.children.length-1].endsAt;
}

function getValidChildren(node: Node) {
    return node.metadataEntries.reduce((agg, curr) => {
        const desiredChild = node.children[curr - 1];
        if(desiredChild) {
            agg.push(desiredChild)
        }

        return agg;
    }, [] as Node[])
}