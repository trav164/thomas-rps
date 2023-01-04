import * as readline from 'node:readline';
var clc = require("cli-color"); // this is not required, just trying to make the console a bit nicer.

// setup interface which is basically a template for the data that we will use for the game.
interface MetaData {
    player: number, // score
    computer: number, // score
    username: string,
    validMoves: string[],
    validGames: string[],
}

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// this is the game data that we need to know. It uses the `MetaData` template that we defined as an interface at the top.
let gameData: MetaData = {
    validMoves: ['r', 'p', 's'], // rock paper scissors
    validGames: ['y', 'n', 'q'], // yes no quit
    username: '',
    player: 0,
    computer: 0,
}

console.log(clc.redBright(`Welcome to the 'Rock, Paper, Scissors' game!`));

// setup a re-usable function whereby we pass it a query string and then it takes user input i.e. keyboard and then returns.
const input = (query: string) => new Promise((resolve: any) => rl.question(query, resolve));

// using the above input function we pass it a question 'what is your name' and then await the input with .then(async)
// once we have the input from the user we set that as the username and then move onto the mainmenu.
input(clc.blueBright('Please enter your user name: ')).then(async (input: any) => {
    gameData.username = input;
    console.log(clc.redBright(`Welcome ${gameData.username.toUpperCase()}`));
    mainMenu();
});

const mainMenu = () => input(clc.blueBright('\nDo you want to play a best of 3?\n1. y - yes\n2. n - no\n3. q - quit\n')).then(async (result: any) => {
    const input = result.toLowerCase();
    if (gameData.validGames.includes(input)) {
        switch (input) {
            case 'y':
                game(true);
                break;
            case 'n':
                game(false);
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

const game = (bo3: boolean): void => {
    console.log(clc.redBright(`Valid Moves: 'r', 'p', 's'`));
    const computerChoice = gameData.validMoves[Math.floor(Math.random() * 3)]; // gets random result from array

    input(clc.blueBright('Make your move: ')).then(async (result: any) => {
        const winner = selectWinner(result.toLowerCase(), computerChoice);
        if (winner) {
            console.log(clc.redBright(winner, '\n'));

            // exit if statement, if bo1 is selected it will return back to main menu after a single winner.
            if (!bo3) {
                mainMenu();
                resetScores();
                return;
            }

            console.log(`\nCurrent scores:\n${gameData.username.toUpperCase()}: ${gameData.player}    :    COMPUTER: ${gameData.computer}\n`);
            if (gameData.computer === 2 || gameData.player === 2) {
                resetScores();
                mainMenu();
            } else {
                game(bo3); // recalls same function passing in the game mode i.e. bo3 or not.
            }
        } else {
            // replay the scenario until someone wins.
            console.log(clc.redBright('Tie!', '\n'));
            game(bo3); // recalls same function passing in the game mode i.e. bo3 or not.
        }
    });
}

const selectWinner = (player: string, computer: string): string => {
    let result: string | null;

    switch (player + computer) {
        case 'rs':
        case 'sr':
        case 'pr':
            result = `${gameData.username.toUpperCase()} wins!`;
            gameData.player++; // 1 to the current score
            break;
        case 'sr':
        case 'ps':
        case 'rp':
            result = 'COMPUTER wins!';
            gameData.computer++; // 1 to the current score
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
    // Keeps original data as is with the ... spread operator.
    // Resets the scores whilst maintining the rest of the data.
    gameData = {
        ...gameData,
        player: 0,
        computer: 0,
    }
}

// When done prompting for player input, close app.
rl.on('close', () => process.exit(0));