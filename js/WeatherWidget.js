// js/WeatherWidget.js
import { UIComponent } from './UIComponent.js';

export class WeatherWidget extends UIComponent {
  constructor(config = {}) {
    super({ ...config, title: config.title || 'Погода сейчас' });
    this.weather = { temp: '--', location: 'Определяем местоположение...' };
  }

  async fetchWeather() {
    try {
      // Получаем координаты по IP
      const geoRes = await fetch('https://ipapi.co/json/');
      const geo = await geoRes.json();
      if (!geo.latitude || !geo.longitude) throw new Error('No geo');

      // Получаем погоду
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${geo.latitude}&longitude=${geo.longitude}&current=temperature_2m&temperature_unit=celsius&timezone=auto`;
      const weatherRes = await fetch(weatherUrl);
      const weather = await weatherRes.json();

      this.weather = {
        temp: Math.round(weather.current.temperature_2m),
        location: geo.city || `${geo.country_name}`
      };
    } catch (err) {
      this.weather = { temp: '--', location: 'Ошибка загрузки' };
    }
  }

  async render() {
    await this.fetchWeather();

    this.element = document.createElement('div');
    this.element.className = 'widget weather-widget';
    this.element.innerHTML = `
      <div class="widget-header">
        <h3>${this.title}</h3>
        <button class="btn-minimize">−</button>
        <button class="btn-close">×</button>
      </div>
      <div class="widget-body">
        <div class="weather-info">
          <span class="temp">${this.weather.temp}°C</span>
          <span class="location">${this.weather.location}</span>
        </div>
        <button class="btn-refresh">🔄 Обновить</button>
      </div>
    `;

    const header = this.element.querySelector('.widget-header');
    header.querySelector('.btn-close').addEventListener('click', () => this.close());
    header.querySelector('.btn-minimize').addEventListener('click', () => this.minimize());

    const refreshBtn = this.element.querySelector('.btn-refresh');
    refreshBtn.addEventListener('click', async () => {
      await this.fetchWeather();
      this.element.querySelector('.temp').textContent = `${this.weather.temp}°C`;
      this.element.querySelector('.location').textContent = this.weather.location;
    });

    return this.element;
  }
}