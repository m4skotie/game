export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 32;
        this.velX = 0;
        this.velY = 0;
        this.speed = 4;
        this.jump = -12;
        this.gravity = 0.6;
        this.onGround = false;
    }

    update(input) {
        if (input.left) this.velX = -this.speed;
        else if (input.right) this.velX = this.speed;
        else this.velX = 0;

        if (input.jump && this.onGround) {
            this.velY = this.jump;
            this.onGround = false;
        }

        this.velY += this.gravity;
        this.x += this.velX;
        this.y += this.velY;
    }

    collides(p) {
        return (
            this.x < p.x + p.width &&
            this.x + this.size > p.x &&
            this.y + this.size > p.y &&
            this.y < p.y + p.height
        );
    }

    landOn(p) {
        this.y = p.y - this.size;
        this.velY = 0;
        this.onGround = true;
    }

    draw(ctx) {
        ctx.font = "32px serif";
        ctx.fillText("😀", this.x, this.y + 28);
    }
}
