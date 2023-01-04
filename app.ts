import * as readline from 'node:readline';
var clc = require("cli-color"); // this is not required, just trying to make the console a bit nicer.

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const validMoves = ['r', 'p', 's'];
let username: string = '';

let scores = {
    player: 0,
    computer: 0,
};

console.log(clc.redBright(`Welcome to the 'Rock, Paper, Scissors' game!`));

const input = (query: any) => new Promise((resolve: any) => rl.question(query, resolve));

input(clc.blueBright('Please enter your user name: ')).then(async (input: any) => {
    username = input;
    console.log(clc.redBright(`Welcome ${username.toUpperCase()}`));
    mainMenu();
});

const mainMenu = () => input(clc.blueBright('\nDo you want to play a best of 3? ')).then(async (result: any) => {
    const input = result.toLowerCase();
    const allowedGames: string[] = ['y', 'n', 'q'];
    if (allowedGames.includes(input)) {
        switch (input) {
            case 'y':
                bo3Game();
                break;
            case 'n':
                bo1Game();
                break;
            case 'q':
                console.log('Bye!');
                rl.close();
                break;
            default:
                break;
        }
    } else {
        // will loop round if not a valid input
        mainMenu();
    }
});


const bo1Game = (): void => {
    console.log(clc.redBright(`Valid Moves: 'r', 'p', 's'`));
    const computerChoice = validMoves[Math.floor(Math.random() * 3)]; // gets random result from array
    input(clc.blueBright('Make your move: ')).then(async (result: any) => {
        const winner = selectWinner(result.toLowerCase(), computerChoice);
        if (winner) {
            console.log(clc.redBright(winner, '\n'));
            mainMenu(); // back to main menu after result.
        } else {
            // replay the scenario until someone wins.
            console.log(clc.redBright('Tie!', '\n'));
            bo1Game();
        }
    });
};

const bo3Game = (): void => {
    console.log(clc.redBright(`Valid Moves: 'r', 'p', 's'`));
    const computerChoice = validMoves[Math.floor(Math.random() * 3)]; // gets random result from array
    input(clc.blueBright('Make your move: ')).then(async (result: any) => {
        const winner = selectWinner(result.toLowerCase(), computerChoice);
        if (winner) {
            console.log(clc.redBright(winner, '\n'));
            console.log('Current scores: ', scores, '\n');
            if (scores.computer === 2 || scores.player === 2) {
                resetScores();
                mainMenu();
            } else {
                bo3Game();
            }
        } else {
            // replay the scenario until someone wins.
            console.log(clc.redBright('Tie!', '\n'));
            bo3Game();
        }
    });
}

const selectWinner = (player: string, computer: string): string => {
    let result: string | null;

    switch (player + computer) {
        case 'rs':
        case 'sr':
        case 'pr':
            result = `${username.toUpperCase()} wins!`;
            scores.player++;
            break;
        case 'sr':
        case 'ps':
        case 'rp':
            result = 'COMPUTER wins!';
            scores.computer++;
            break;
        case 'pp':
        case 'ss':
        case 'rr':
            result = null;
            break;
        default:
            result = null;
            break;
    }
    return result!;
}

const resetScores = (): void => {
    scores = {
        player: 0,
        computer: 0,
    };
}

// When done prompting for player input, close app.
rl.on('close', () => process.exit(0));