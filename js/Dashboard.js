// js/Dashboard.js
import { ToDoWidget } from './ToDoWidget.js';
import { QuoteWidget } from './QuoteWidget.js';
import { WeatherWidget } from './WeatherWidget.js';

export class Dashboard {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.widgets = [];
  }

  addWidget(type) {
    let widget;
    const config = { id: `widget-${Date.now()}` };

    switch (type) {
      case 'todo':
        widget = new ToDoWidget(config);
        break;
      case 'quote':
        widget = new QuoteWidget(config);
        break;
      case 'weather':
        widget = new WeatherWidget(config);
        break;
      default:
        throw new Error('Неизвестный тип виджета');
    }

    const element = widget.render();
    this.container.appendChild(element);
    this.widgets.push(widget);
  }

  removeWidget(widgetId) {
    const index = this.widgets.findIndex(w => w.id === widgetId);
    if (index !== -1) {
      this.widgets[index].destroy();
      this.widgets.splice(index, 1);
    }
  }
}