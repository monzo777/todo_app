import Todos from "./class/Todos.js";

const todoList = document.querySelector("#todo-list");
const todoInput = document.querySelector("#todo-input");
const todos = new Todos("http://localhost:3001");

function renderSpan(listItem, text) {
  const span = document.createElement("span");
  span.textContent = text;
  listItem.appendChild(span);
}

function renderLink(listItem, taskId) {
  const link = document.createElement("a");
  link.href = "#";
  link.className = "delete-link";

  const icon = document.createElement("i");
  icon.className = "bi bi-trash";

  link.appendChild(icon);
  link.addEventListener("click", (event) => {
    event.preventDefault();

    todos.removeTask(taskId)
      .then((deletedTaskId) => {
        const taskElement = todoList.querySelector(`[data-key="${deletedTaskId}"]`);

        if (taskElement) {
          taskElement.remove();
        }
      })
      .catch((error) => {
        console.error("Unable to delete task:", error);
      });
  });

  listItem.appendChild(link);
}

function renderTask(task) {
  const listItem = document.createElement("li");
  listItem.className = "list-group-item";
  listItem.dataset.key = task.getId();

  renderSpan(listItem, task.getText());
  renderLink(listItem, task.getId());

  todoList.appendChild(listItem);
}

function getTasks() {
  todos.getTasks()
    .then((tasks) => {
      todoList.innerHTML = "";
      tasks.forEach(renderTask);
      todoInput.disabled = false;
    })
    .catch((error) => {
      console.error("Unable to load tasks:", error);
    });
}

todoInput.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") {
    return;
  }

  event.preventDefault();

  const taskText = todoInput.value.trim();

  if (taskText === "") {
    return;
  }

  todos.addTask(taskText)
    .then((task) => {
      renderTask(task);
      todoInput.value = "";
      todoInput.focus();
    })
    .catch((error) => {
      console.error("Unable to save task:", error);
    });
});

getTasks();
