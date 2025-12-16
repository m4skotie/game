export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 30;
    this.h = 30;
    this.vx = 0;
    this.vy = 0;
    this.speed = 5;
    this.jumpPower = 14;
    this.gravity = 0.6;
    this.onGround = false;
  }

  update(input) {
    this.vx = 0;

    if (input.keys['ArrowLeft'] || input.keys['a'] || input.keys['A']) {
      this.vx = -this.speed;
    }
    if (input.keys['ArrowRight'] || input.keys['d'] || input.keys['D']) {
      this.vx = this.speed;
    }

    if ((input.keys[' '] || input.keys['ArrowUp'] || input.keys['w'] || input.keys['W']) && this.onGround) {
      this.vy = -this.jumpPower;
      this.onGround = false;
    }

    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;

    // Границы
    if (this.x < 0) this.x = 0;
    if (this.x + this.w > 800) this.x = 800 - this.w;
  }

  checkCollision(obj) {
    return (
      this.x < obj.x + obj.w &&
      this.x + this.w > obj.x &&
      this.y < obj.y + obj.h &&
      this.y + this.h > obj.y
    );
  }

  draw(ctx) {
    ctx.font = '30px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('😄', this.x, this.y + this.h);
  }
}
