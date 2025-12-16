// js/UIComponent.js
export class UIComponent {
  constructor(config = {}) {
    this.id = config.id || `widget-${Date.now()}`;
    this.title = config.title || 'Widget';
    this.element = null;
    this.eventHandlers = [];
  }

  render() {
    throw new Error('Метод render() должен быть переопределён в дочернем классе');
  }

  // Вспомогательный метод для привязки слушателей с сохранением ссылки
  addEventListener(element, event, handler) {
    element.addEventListener(event, handler);
    this.event.handlers.push({ element, event, handler });
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    // Удаляем все слушатели (если использовали addEventListener выше)
    this.eventHandlers.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.eventHandlers = [];
  }

  minimize() {
    if (this.element) {
      this.element.classList.toggle('minimized');
    }
  }

  close() {
    this.destroy();
  }
}