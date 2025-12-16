import { Game } from './Game.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const bgMusic = document.getElementById('bgMusic');
const deathSound = document.getElementById('deathSound');

// Инициализация аудио при первом взаимодействии (обход ограничений браузера)
function initAudio() {
  bgMusic.volume = 0.4;
  deathSound.volume = 0.7;
  if (bgMusic.paused) {
    bgMusic.play().catch(e => console.log("Music autoplay prevented:", e));
  }
}

// Создаём игру с передачей аудио
const game = new Game(canvas, ctx, bgMusic, deathSound);

// Первый клик — включает музыку
document.body.addEventListener('click', initAudio, { once: true });

// Обработчики кнопок
document.getElementById('restart').addEventListener('click', () => {
  game.restart();
  bgMusic.play();
});

document.getElementById('next-level-btn').addEventListener('click', () => {
  game.nextLevel();
  document.getElementById('overlay').classList.add('hidden');
  bgMusic.play();
});

document.getElementById('try-again-btn').addEventListener('click', () => {
  game.restart();
  bgMusic.play();
  document.getElementById('overlay').classList.add('hidden');
});
