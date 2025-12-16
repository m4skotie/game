export class Hazard {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  draw(ctx) {
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    // Рисуем огонь с шагом 30px для плотности
    for (let i = this.x + 15; i < this.x + this.w; i += 30) {
      ctx.fillText('🔥', i, this.y + 12);
    }
  }
}
