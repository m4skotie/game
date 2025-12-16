export class Item {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.baseY = y;
    this.w = 24;
    this.h = 24;
    this.time = Math.random() * Math.PI * 2;
  }

  update() {
    this.time += 0.05;
    this.y = this.baseY + Math.sin(this.time) * 4;
  }

  draw(ctx) {
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🍒', this.x + 12, this.y + 20);
  }
}
