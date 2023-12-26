const apiUrl = "http://localhost:3000/";
const container = document.getElementById("todo-container");
const addModal = document.getElementById("addModal");
const editModal = document.getElementById("editModal");
let todos;

function showAllTodos(todos) {
  container.innerHTML = "";

  const table = document.createElement("table");
  table.innerHTML = `
      <tr>
          <th>Todo Name</th>
          <th>End Date</th>
          <th>Status</th>
          <th>Edit</th>
          <th>Delete</th>
      </tr>`;

  for (const todo of todos) {
    const row = table.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);
    const cell5 = row.insertCell(4);

    cell1.innerHTML = todo.text;
    cell2.innerHTML = todo.endDate;
    cell3.innerHTML = `<input type="checkbox" ${todo.done ? 'checked' : ''} onclick="changeStatus('${todo.id}')">`;
    cell4.innerHTML = `<button class="edit-btn" onclick="editTodo('${todo.id}')">Edit</button>`;
    cell5.innerHTML = `<button class="delete-btn" onclick="deleteTodo('${todo.id}')">Delete</button>`;
  }

  container.appendChild(table);
}

function openModal(modal) {
  modal.style.display = "block";
}

function closeModal(modal) {
  modal.style.display = "none";
}

function getAllTodos() {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      todos = data;
      showAllTodos(data);
    })
    .catch((error) => {
      console.error("Error fetching todos:", error);
    });
}

function addTodo() {
  event.preventDefault();
  var name = document.getElementById("addTodoName").value;
  var endDate = document.getElementById("addEndDate").value;

  console.log(name);
  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      endDate,
    }),
  })
    .then(() => addModal.style.display = "none")
    .catch((error) => {
      console.error("Error adding todo:", error);
    });
}

function editTodo(id) {
  const todoToEdit = todos.find(todo => todo.id === id);
  openModal(editModal);

  document.getElementById("editTodoName").value = todoToEdit.text;
  document.getElementById("editEndDate").value = todoToEdit.endDate;

  const editForm = document.getElementById("editTodoForm");
  editForm.onsubmit = function (event) {
    event.preventDefault();

    const newName = document.getElementById("editTodoName").value;
    const newEndDate = document.getElementById("editEndDate").value;

    fetch(`${apiUrl}${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newName,
        endDate: newEndDate,
      }),
    })
      .then(() => closeModal(editModal))
      .catch((error) => {
        console.error("Error fetching todos:", error);
      });
  };
}

function changeStatus(id) {
  fetch(`${apiUrl}${id}/status`, {
    method: "PUT"
  })
  .catch((error) => {
    console.error("Error fetching todos:", error);
  });
}

function deleteTodo(id) {
  fetch(`${apiUrl}${id}`, {
    method: "DELETE"
  })
    .catch((error) => {
      console.error("Error deleting todo:", error);
    });
}

window.onload = function () {
  getAllTodos();

  document.getElementById("openAddModal").addEventListener("click", () => {
    openModal(addModal);
  })

  const spans = document.getElementsByClassName("close");
  for (const span of spans) {
    span.onclick = function () {
      closeModal(addModal);
      closeModal(editModal);
    };
  }
};

window.onclick = function (event) {
  if (event.target == addModal) {
    closeModal(addModal);
  }
  if (event.target == editModal) {
    closeModal(editModal);
  }
};