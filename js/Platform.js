export class Platform {
    constructor(x, y, width, height, emoji) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.emoji = emoji;
    }

    draw(ctx) {
        ctx.font = "24px serif";
        for (let i = 0; i < this.width; i += 24) {
            ctx.fillText(this.emoji, this.x + i, this.y + 20);
        }
    }
}
