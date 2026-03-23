const todoList = document.querySelector("#todo-list");
const todoInput = document.querySelector("#todo-input");
const backendUrl = "http://localhost:3001";

function renderTask(task) {
  const listItem = document.createElement("li");
  listItem.className = "list-group-item";
  listItem.textContent = task.description;

  todoList.appendChild(listItem);
}

async function getTasks() {
  try {
    const response = await fetch(backendUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }

    const tasks = await response.json();
    todoList.innerHTML = "";
    tasks.forEach(renderTask);
    todoInput.disabled = false;
  } catch (error) {
    console.error("Unable to load tasks:", error);
  }
}

function saveTask(description) {
  return fetch(`${backendUrl}/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ description }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to save task");
    }

    return response.json();
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

  saveTask(taskText)
    .then((task) => {
      renderTask(task);
      todoInput.value = "";
    })
    .catch((error) => {
      console.error("Unable to save task:", error);
    });
});

getTasks();
