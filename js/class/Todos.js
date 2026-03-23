import Task from "./Task.js";

class Todos {
  #backendUrl;
  #tasks;

  constructor(backendUrl) {
    this.#backendUrl = backendUrl;
    this.#tasks = [];
  }

  async getTasks() {
    return fetch(this.#backendUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        return response.json();
      })
      .then((json) => {
        this.#readJson(json);
        return this.#tasks;
      });
  }

  addTask(description) {
    return fetch(`${this.#backendUrl}/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save task");
        }

        return response.json();
      })
      .then((json) => this.#addTask(json));
  }

  #readJson(json) {
    this.#tasks = json.map((item) => new Task(item.id, item.description));
  }

  #addTask(json) {
    const task = new Task(json.id, json.description);
    this.#tasks.push(task);
    return task;
  }
}

export default Todos;
