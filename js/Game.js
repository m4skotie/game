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
        platforms: [
          { x: 0, y: 480, w: 800, h: 20 },
          { x: 200, y: 400, w: 100, h: 20 },
          { x: 400, y: 320, w: 100, h: 20 },
          { x: 600, y: 240, w: 100, h: 20 }
        ],
        items: [
          { x: 240, y: 370 },
          { x: 440, y: 290 },
          { x: 640, y: 210 }
        ],
        goal: { x: 750, y: 200 }
      },
      {
        platforms: [
          { x: 0, y: 480, w: 800, h: 20 },
          { x: 100, y: 420, w: 80, h: 20 },
          { x: 200, y: 360, w: 80, h: 20 },
          { x: 300, y: 300, w: 80, h: 20 },
          { x: 400, y: 240, w: 80, h: 20 },
          { x: 500, y: 180, w: 80, h: 20 },
          { x: 600, y: 120, w: 80, h: 20 }
        ],
        items: [
          { x: 130, y: 390 },
          { x: 230, y: 330 },
          { x: 330, y: 270 },
          { x: 430, y: 210 },
          { x: 530, y: 150 },
          { x: 630, y: 90 }
        ],
        goal: { x: 700, y: 90 }
      },
      {
        platforms: [
          { x: 0, y: 480, w: 800, h: 20 },
          { x: 150, y: 400, w: 60, h: 20 },
          { x: 350, y: 350, w: 60, h: 20 },
          { x: 550, y: 300, w: 60, h: 20 },
          { x: 250, y: 250, w: 60, h: 20 },
          { x: 450, y: 200, w: 60, h: 20 },
          { x: 650, y: 150, w: 60, h: 20 }
        ],
        items: [
          { x: 170, y: 370 },
          { x: 370, y: 320 },
          { x: 570, y: 270 },
          { x: 270, y: 220 },
          { x: 470, y: 170 },
          { x: 670, y: 120 },
          { x: 720, y: 120 }
        ],
        goal: { x: 750, y: 120 }
      }
    ];
  }

  loadLevel(levelIndex) {
    const level = this.levels[levelIndex];
    this.platforms = level.platforms.map(p => new Platform(p.x, p.y, p.w, p.h));
    this.items = level.items.map(i => new Item(i.x, i.y));
    this.goal = { ...level.goal, collected: false };
    this.hazards = [new Hazard(0, this.canvas.height - 20, this.canvas.width, 20)];
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
        // Только если падаем вниз И голова игрока выше платформы
        if (this.player.vy > 0 && this.player.y + this.player.h < platform.y + 10) {
          this.player.y = platform.y - this.player.h;
          this.player.vy = 0;
          onGround = true;
        }
      }
    });
    this.player.onGround = onGround;
  
    // Огонь — смерть
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
  
    // Флаг
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
  
    // Падение в бездну (страховка)
    if (this.player.y > this.canvas.height + 100) {
      this.gameOver = true;
      this.showOverlay('💀 Упал в бездну!', false);
    }
  }


  gameLoop = () => {
    this.update();
    this.render();
    requestAnimationFrame(this.gameLoop);
  };
}



