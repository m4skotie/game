import { Game } from './Game.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const game = new Game(canvas, ctx);
game.start();

document.getElementById('restart').addEventListener('click', () => {
  game.restart();
});

document.getElementById('next-level-btn').addEventListener('click', () => {
  game.nextLevel();
  document.getElementById('overlay').classList.add('hidden');
});

document.getElementById('try-again-btn').addEventListener('click', () => {
  game.restart();
  document.getElementById('overlay').classList.add('hidden');
});
