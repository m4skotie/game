export class Hazard {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  draw(ctx) {
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    // Рисуем огонь по всей ширине с шагом
    for (let i = this.x + 12; i < this.x + this.w; i += 24) {
      ctx.fillText('🔥', i, this.y + 20);
    }
  }
}
