import Todos from "./class/Todos.js";

const todoList = document.querySelector("#todo-list");
const todoInput = document.querySelector("#todo-input");
const todos = new Todos("http://localhost:3001");

function renderTask(task) {
  const listItem = document.createElement("li");
  listItem.className = "list-group-item";
  listItem.textContent = task.getText();
  listItem.dataset.id = task.getId();

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
