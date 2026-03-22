const todoList = document.querySelector("#todo-list");
const todoInput = document.querySelector("#todo-input");

todoInput.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") {
    return;
  }

  event.preventDefault();

  const taskText = todoInput.value.trim();

  if (taskText === "") {
    return;
  }

  const listItem = document.createElement("li");
  listItem.className = "list-group-item";
  listItem.textContent = taskText;

  todoList.appendChild(listItem);
  todoInput.value = "";
});
