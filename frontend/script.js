const apiUrl = "http://localhost:3000/";
const container = document.getElementById("todo-container");
const modal = document.getElementById('modal');

function changeStatus(id) {
  return function () {
    fetch(`${apiUrl}${id}`, {
      method: "PUT"
    })
      .catch((error) => {
        console.error("Error fetching todos:", error);
      });
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

function addTodo() {
  event.preventDefault();
  var name = document.getElementById('todoName').value;
  console.log(name);
  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
    }),
  })
  .then(() => modal.style.display = 'none')
  .catch((error) => {
    console.error("Error adding todo:", error);
  });
}

function openModal() {
  modal.style.display = 'block';
}

window.onload = function () {
  getAllTodos();

  const span = document.getElementsByClassName('close')[0];
  span.onclick = function () {
    modal.style.display = 'none';
  };
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};