import { Player } from './Player.js';
import { Platform } from './Platform.js';
import { InputHandler } from './InputHandler.js';

export class Game {
    constructor(canvas, ctx, info) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.info = info;

        this.level = 0;
        this.score = 0;
        this.running = false;

        this.input = new InputHandler();
        this.loadLevel();
    }

    loadLevel() {
        const levels = [
            [
                new Platform(0, 360, 800, 40, "🟫"),
                new Platform(300, 300, 120, 20, "🟩"),
                new Platform(550, 250, 120, 20, "🟩"),
            ],
            [
                new Platform(0, 360, 800, 40, "🟫"),
                new Platform(200, 300, 100, 20, "🟦"),
                new Platform(400, 260, 100, 20, "🟦"),
                new Platform(600, 220, 100, 20, "🟦"),
            ],
            [
                new Platform(0, 360, 800, 40, "🟥"),
                new Platform(250, 280, 100, 20, "🟥"),
                new Platform(450, 220, 100, 20, "🟥"),
                new Platform(650, 160, 100, 20, "🟥"),
            ]
        ];

        this.platforms = levels[this.level];
        this.player = new Player(50, 0);
    }

    start() {
        if (!this.running) {
            this.running = true;
            this.loop();
        }
    }

    restart() {
        this.level = 0;
        this.score = 0;
        this.loadLevel();
        this.start();
    }

    nextLevel() {
        this.level++;
        if (this.level > 2) {
            alert("🎉 Победа! Ты прошёл все уровни!");
            this.running = false;
            return;
        }
        this.loadLevel();
    }

    update() {
        this.player.update(this.input);

        this.platforms.forEach(p => {
            if (this.player.collides(p)) {
                this.player.landOn(p);
            }
        });

        if (this.player.y > this.canvas.height) {
            this.running = false;
            alert("💀 Ты упал!");
        }

        if (this.player.x > this.canvas.width - 40) {
            this.score += 100;
            this.nextLevel();
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, 800, 400);

        this.platforms.forEach(p => p.draw(this.ctx));
        this.player.draw(this.ctx);

        this.info.textContent = `Уровень: ${this.level + 1} | Очки: ${this.score}`;
    }

    loop() {
        if (!this.running) return;
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }
}
