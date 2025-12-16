export class Item {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 24;
    this.h = 24;
  }

  draw(ctx) {
    ctx.fillText('⭐', this.x + 12, this.y + 20);
  }
}
