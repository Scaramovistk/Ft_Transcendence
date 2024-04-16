import { Game } from './internal.js';

export const maxScore = 3;

export const rules = [`Move the paddle up/down with W/S keys`,
`Avoid missing ball for high score`,
`The first player with a score of ${maxScore} wins`];

export const pongGame = new Game();

pongGame.gameBoard.draw();
pongGame.start();
