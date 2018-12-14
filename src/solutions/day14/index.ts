import { Solution } from 'src/utilities/solver';

export default class Day02 implements Solution {
    async solvePart1(input: string[]) {
        const trainingLength = parseInt(input[0]);
        let [elf1Recipe, elf2Recipe] = initialize();
        let firstRecipe = elf1Recipe;
        let lastRecipe = elf2Recipe;
        
        for(let i = 0; i < trainingLength + 10; i++) {
            const newRecipes = makeNewRecipe(elf1Recipe, elf2Recipe);
            if(Array.isArray(newRecipes)) {
                lastRecipe.nextRecipe = newRecipes[0];
                newRecipes[1].nextRecipe = firstRecipe;
                lastRecipe = newRecipes[1];
            } else {
                lastRecipe.nextRecipe = newRecipes;
                newRecipes.nextRecipe = firstRecipe;
                lastRecipe = newRecipes;
            }
            
            elf1Recipe = doJumps(elf1Recipe);
            elf2Recipe = doJumps(elf2Recipe);
        }


        return readResult(firstRecipe, trainingLength);
    }

    async solvePart2(input: string[]) {
        const sequence = input[0].split('').map(i => parseInt(i));
        let counter = 2;
        const recipes = Array.from({length: 25000000}, _ => 0);
        recipes[0] = 3;
        recipes[1] = 7;
        let elf1 = 0;
        let elf2 = 1;

        while(!containsSequence(sequence, recipes, counter)) {
            counter += makeNewRecipe2(elf1, elf2, recipes, counter);
            elf1 = getNextPosition(elf1, recipes, counter);
            elf2 = getNextPosition(elf2, recipes, counter);
            if(counter % 10000 === 0) {
                console.log(counter);
            }
        }

        return counter - sequence.length;
    }
}

function makeNewRecipe2(elf1: number, elf2: number, recipes: number[], counter: number) {
    const totalScore = recipes[elf1] + recipes[elf2];
    if(totalScore < 10) {
        recipes[counter] = totalScore;
        return 1;
    } else {
        recipes[counter] = 1;
        recipes[counter + 1] = totalScore - 10;
        return 2;
    }
}

function getNextPosition(elf: number, recipes: number[], counter: number) {
    return (recipes[elf] + 1 + elf) % counter;
}

interface Recipe {
    nextRecipe: Recipe;
    score: number;
}

function printRecipes(firstRecipe: Recipe) {
    let tmp = firstRecipe;
    const line = [];
    
    do {
        line.push(tmp.score);
        tmp = tmp.nextRecipe;
    } while(tmp !== firstRecipe)
    
    console.log(line.join(' '));
}

function containsSequence(sequence: number[], recipes: number[], counter: number) {
    for(let i = 0; i < sequence.length; i++) {
        if(recipes[counter - sequence.length + i] !== sequence[i]) {
            return false;
        }
    }
    return true;
}

function initialize() {
    const elf1Recipe = {
        score: 3
    } as Recipe;

    const elf2Recipe = {
        score: 7
    } as Recipe;

    elf1Recipe.nextRecipe = elf2Recipe;
    elf2Recipe.nextRecipe = elf1Recipe;
    return [elf1Recipe, elf2Recipe];
}

function makeNewRecipe(recipe1: Recipe, recipe2: Recipe) {
    const totalScore = recipe1.score + recipe2.score;
    if(totalScore < 10) {
        return {
            score: totalScore,
        } as Recipe;
    } else {
        const firstRecipe = {
            score: 1
        } as Recipe
        const secondRecipe = {
            score: totalScore - 10
        } as Recipe

        firstRecipe.nextRecipe = secondRecipe;

        return [firstRecipe, secondRecipe];
    }
}

function doJumps(recipe: Recipe) {
    let result = recipe;
    for (let i = 0; i <= recipe.score; i++) {
        result = result.nextRecipe;
    }

    return result;
}

function readResult(firstRecipe: Recipe, skip: number) {
    let tmp = firstRecipe;
    for(let i = 0; i < skip - 1; i++) {
        tmp = tmp.nextRecipe;
    }

    const result = [];
    for(let i = 0; i < 10; i++) {
        tmp = tmp.nextRecipe;
        result.push(tmp.score);
    }

    return result.join('');
}
