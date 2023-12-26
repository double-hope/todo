const apiUrl = "http://localhost:3000/";
const container = document.getElementById("todo-container");

function changeStatus(id) {
  return function () {
    fetch(`${apiUrl}${id}`, {
        method: "PUT"
        })
        .catch((error) => {
            console.error("Error fetching todos:", error);
        });
    console.log("Changing status for todo with id:", id);
  };
}

function showAllTodos(todos) {
  for (const todo of todos) {
    const item = document.createElement("div");
    const checkbox = document.createElement("input");
    const todoInfo = document.createElement("div");

    checkbox.type = "checkbox";
    checkbox.checked = todo.done;

    todoInfo.innerHTML = `<p>${todo.text}</p>`;
    todoInfo.className = `${todo.done ? "done" : ""}`;
    item.className = "todo-item";

    item.appendChild(checkbox);
    item.appendChild(todoInfo);

    item.addEventListener("click", changeStatus(todo.id));
    container.appendChild(item);
  }
}

function getAllTodos() {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      showAllTodos(data);
    })
    .catch((error) => {
      console.error("Error fetching todos:", error);
    });
}

window.onload = function () {
  getAllTodos();
};
