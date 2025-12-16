import { Player } from './Player.js';
import { Platform } from './Platform.js';
import { Item } from './Item.js';
import { Hazard } from './Hazard.js';
import { InputHandler } from './InputHandler.js';

export class Game {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.input = new InputHandler();
    this.resetLevelData();
    this.scoreElement = document.getElementById('score-value');
    this.bestScoreElement = document.getElementById('best-value');
    this.levelElement = document.getElementById('level-value');
    this.overlay = document.getElementById('overlay');
    this.messageElement = document.getElementById('message');
    this.nextBtn = document.getElementById('next-level-btn');
    this.tryBtn = document.getElementById('try-again-btn');
    this.loadBestScore();
  }

  resetLevelData() {
    this.currentLevel = 0;
    this.score = 0;
    this.levels = [
      {
        platforms: [{ x: 0, y: 470, w: 800, h: 15 }],
        hazards: [
          { x: 100, y: 470, w: 80, h: 15 },
          { x: 600, y: 470, w: 100, h: 15 }
        ],
        items: [
          { x: 200, y: 430 },
          { x: 400, y: 430 },
          { x: 700, y: 430 }
        ],
        goal: { x: 750, y: 430 }
      },
      {
        platforms: [
          { x: 0, y: 470, w: 800, h: 15 },
          { x: 150, y: 400, w: 70, h: 15 },
          { x: 300, y: 340, w: 70, h: 15 },
          { x: 450, y: 280, w: 70, h: 15 },
          { x: 600, y: 220, w: 70, h: 15 }
        ],
        hazards: [
          { x: 200, y: 470, w: 100, h: 15 },
          { x: 350, y: 470, w: 90, h: 15 },
          { x: 500, y: 470, w: 80, h: 15 },
          { x: 280, y: 400, w: 40, h: 15 }
        ],
        items: [
          { x: 175, y: 370 },
          { x: 325, y: 310 },
          { x: 475, y: 250 },
          { x: 625, y: 190 }
        ],
        goal: { x: 650, y: 190 }
      },
      {
        platforms: [
          { x: 0, y: 470, w: 800, h: 15 },
          { x: 100, y: 400, w: 60, h: 15 },
          { x: 250, y: 350, w: 60, h: 15 },
          { x: 400, y: 300, w: 60, h: 15 },
          { x: 550, y: 250, w: 60, h: 15 },
          { x: 700, y: 200, w: 60, h: 15 }
        ],
        hazards: [
          { x: 50, y: 470, w: 100, h: 15 },
          { x: 200, y: 470, w: 120, h: 15 },
          { x: 350, y: 470, w: 100, h: 15 },
          { x: 500, y: 470, w: 100, h: 15 },
          { x: 130, y: 400, w: 30, h: 15 },
          { x: 280, y: 350, w: 30, h: 15 },
          { x: 430, y: 300, w: 30, h: 15 }
        ],
        items: [
          { x: 120, y: 370 },
          { x: 270, y: 320 },
          { x: 420, y: 270 },
          { x: 570, y: 220 },
          { x: 720, y: 170 }
        ],
        goal: { x: 730, y: 170 }
      }
    ];
  }

  loadLevel(levelIndex) {
    const level = this.levels[levelIndex];
    this.platforms = level.platforms.map(p => new Platform(p.x, p.y, p.w, p.h));
    this.hazards = level.hazards.map(h => new Hazard(h.x, h.y, h.w, h.h));
    this.items = level.items.map(i => new Item(i.x, i.y));
    this.goal = { ...level.goal, collected: false };
    this.player = new Player(50, 400);
    this.gameOver = false;
    this.hasWon = false;
    this.updateUI();
  }

  loadBestScore() {
    this.bestScore = parseInt(localStorage.getItem('alienRunBestScore')) || 0;
    this.bestScoreElement.textContent = this.bestScore;
  }

  saveBestScore() {
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem('alienRunBestScore', this.bestScore);
      this.bestScoreElement.textContent = this.bestScore;
    }
  }

  start() {
    this.loadLevel(0);
    this.gameLoop();
  }

  restart() {
    this.score = 0;
    this.loadLevel(0);
  }

  nextLevel() {
    this.currentLevel++;
    if (this.currentLevel >= this.levels.length) {
      this.saveBestScore();
      this.showOverlay('🎉 Ты прошёл все уровни! Поздравляю!');
      this.nextBtn.classList.add('hidden');
      this.tryBtn.classList.remove('hidden');
    } else {
      this.loadLevel(this.currentLevel);
    }
  }

  updateUI() {
    this.scoreElement.textContent = this.score;
    this.levelElement.textContent = this.currentLevel + 1;
  }

  showOverlay(message, showNext = false) {
    this.messageElement.textContent = message;
    this.nextBtn.classList.toggle('hidden', !showNext);
    this.tryBtn.classList.toggle('hidden', showNext);
    this.overlay.classList.remove('hidden');
  }

  checkCollisions() {
    let onGround = false;
    this.platforms.forEach(platform => {
      if (this.player.checkCollision(platform)) {
        if (this.player.vy > 0 && this.player.y + this.player.h < platform.y + 12) {
          this.player.y = platform.y - this.player.h;
          this.player.vy = 0;
          onGround = true;
        }
      }
    });
    this.player.onGround = onGround;

    // 🔥 Смерть от огня
    this.hazards.forEach(hazard => {
      if (this.player.checkCollision(hazard)) {
        this.gameOver = true;
        this.showOverlay('💀 Ты сгорел! Попробуй снова.');
      }
    });

    // Сбор вишен
    this.items = this.items.filter(item => {
      if (this.player.checkCollision(item)) {
        this.score += 10;
        this.updateUI();
        return false;
      }
      return true;
    });

    // Флаг финиша
    if (!this.goal.collected &&
        this.player.x < this.goal.x + 30 &&
        this.player.x + this.player.w > this.goal.x &&
        this.player.y < this.goal.y + 30 &&
        this.player.y + this.player.h > this.goal.y) {
      this.goal.collected = true;
      this.hasWon = true;
      this.saveBestScore();
      this.showOverlay('🏆 Уровень пройден!', true);
    }

    // Падение в бездну
    if (this.player.y > this.canvas.height + 100) {
      this.gameOver = true;
      this.showOverlay('💀 Упал в бездну!', false);
    }
  }

  update() {
    if (this.gameOver || this.hasWon) return;
    this.player.update(this.input);
    this.items.forEach(item => item.update());
    this.checkCollisions();
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Платформы
    this.ctx.fillStyle = '#3a3a5a';
    this.platforms.forEach(p => p.draw(this.ctx));

    // Вишни
    this.items.forEach(item => item.draw(this.ctx));

    // 🔥 Огонь — выборочные зоны
    this.hazards.forEach(h => h.draw(this.ctx));

    // Флаг финиша
    if (!this.goal.collected) {
      this.ctx.font = '28px Arial';
      this.ctx.textAlign = 'left';
      this.ctx.fillText('🏁', this.goal.x, this.goal.y + 25);
    }

    // Игрок
    this.player.draw(this.ctx);
  }

  gameLoop = () => {
    this.update();
    this.render();
    requestAnimationFrame(this.gameLoop);
  };
}
