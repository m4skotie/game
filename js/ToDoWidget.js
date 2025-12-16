// js/ToDoWidget.js
import { UIComponent } from './UIComponent.js';

export class ToDoWidget extends UIComponent {
  constructor(config = {}) {
    super({ ...config, title: config.title || 'Список дел' });
    this.tasks = JSON.parse(localStorage.getItem(`tasks-${this.id}`)) || [];
  }

  saveTasks() {
    localStorage.setItem(`tasks-${this.id}`, JSON.stringify(this.tasks));
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'widget todo-widget';
    this.element.innerHTML = `
      <div class="widget-header">
        <h3>${this.title}</h3>
        <button class="btn-minimize">−</button>
        <button class="btn-close">×</button>
      </div>
      <div class="widget-body">
        <div class="input-group">
          <input type="text" placeholder="Новая задача..." class="task-input">
          <button class="btn-add">➕</button>
        </div>
        <ul class="task-list"></ul>
      </div>
    `;

    const header = this.element.querySelector('.widget-header');
    header.querySelector('.btn-close').addEventListener('click', () => this.close());
    header.querySelector('.btn-minimize').addEventListener('click', () => this.minimize());

    const input = this.element.querySelector('.task-input');
    const addButton = this.element.querySelector('.btn-add');
    const taskList = this.element.querySelector('.task-list');

    addButton.addEventListener('click', () => this.addTask(input, taskList));
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addTask(input, taskList);
    });

    this.renderTasks(taskList);
    return this.element;
  }

  addTask(input, taskList) {
    const text = input.value.trim();
    if (text) {
      this.tasks.push({ id: Date.now(), text, done: false });
      this.saveTasks();
      input.value = '';
      this.renderTasks(taskList);
    }
  }

  renderTasks(taskList) {
    taskList.innerHTML = '';
    this.tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = task.done ? 'task done' : 'task';
      li.innerHTML = `
        <input type="checkbox" ${task.done ? 'checked' : ''} data-id="${task.id}">
        <span>${task.text}</span>
        <button class="btn-delete" data-id="${task.id}">×</button>
      `;
      taskList.appendChild(li);
    });

    // Обработчики для чекбоксов и удаления
    taskList.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const id = Number(e.target.dataset.id);
        const task = this.tasks.find(t => t.id === id);
        if (task) {
          task.done = e.target.checked;
          this.saveTasks();
          this.renderTasks(taskList);
        }
      });
    });

    taskList.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = Number(e.target.dataset.id);
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveTasks();
        this.renderTasks(taskList);
      });
    });
  }

  destroy() {
    super.destroy();
    localStorage.removeItem(`tasks-${this.id}`);
  }
}