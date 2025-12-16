// js/QuoteWidget.js
import { UIComponent } from './UIComponent.js';

export class QuoteWidget extends UIComponent {
  constructor(config = {}) {
    super({ ...config, title: config.title || 'Цитата дня' });
    this.currentQuote = { content: 'Загрузка...', author: '' };
  }

  async fetchQuote() {
    try {
      const res = await fetch('https://api.quotable.io/random');
      if (res.ok) {
        this.currentQuote = await res.json();
      } else {
        this.currentQuote = { content: 'Не удалось загрузить цитату.', author: '' };
      }
    } catch (err) {
      this.currentQuote = { content: 'Ошибка сети.', author: '' };
    }
  }

  async render() {
    await this.fetchQuote();

    this.element = document.createElement('div');
    this.element.className = 'widget quote-widget';
    this.element.innerHTML = `
      <div class="widget-header">
        <h3>${this.title}</h3>
        <button class="btn-minimize">−</button>
        <button class="btn-close">×</button>
      </div>
      <div class="widget-body">
        <blockquote>"${this.currentQuote.content}"</blockquote>
        <p>— ${this.currentQuote.author || 'Неизвестный автор'}</p>
        <button class="btn-refresh">🔄 Обновить</button>
      </div>
    `;

    const header = this.element.querySelector('.widget-header');
    header.querySelector('.btn-close').addEventListener('click', () => this.close());
    header.querySelector('.btn-minimize').addEventListener('click', () => this.minimize());

    const refreshBtn = this.element.querySelector('.btn-refresh');
    refreshBtn.addEventListener('click', async () => {
      await this.fetchQuote();
      this.element.querySelector('blockquote').textContent = `"${this.currentQuote.content}"`;
      this.element.querySelector('p').textContent = `— ${this.currentQuote.author || 'Неизвестный автор'}`;
    });

    return this.element;
  }
}