import { Game } from './Game.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const info = document.getElementById('info');

let game = new Game(canvas, ctx, info);

document.getElementById('startBtn').onclick = () => game.start();
document.getElementById('restartBtn').onclick = () => game.restart();
