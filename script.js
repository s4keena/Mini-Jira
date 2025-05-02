let currentProject = null;

function createProject() {
  const nameInput = document.getElementById("projectName");
  const name = nameInput.value.trim();

  if (!name) {
    alert("Please enter a project name.");
    return;
  }

  let projects = JSON.parse(localStorage.getItem("projects") || "{}");

  if (projects[name]) {
    alert("Project with this name already exists.");
    return;
  }

  projects[name] = { todo: [], doing: [], done: [] };
  localStorage.setItem("projects", JSON.stringify(projects));

  nameInput.value = "";
  loadProjectList();
}

function loadProjectList() {
  const list = document.getElementById("projectList");
  list.innerHTML = "";

  const projects = JSON.parse(localStorage.getItem("projects") || "{}");

  for (let name in projects) {
    const li = document.createElement("li");
    li.textContent = name;
    li.onclick = () => loadProjectUI(name);
    list.appendChild(li);
  }
}

function loadProjectUI(projectName) {
  currentProject = projectName;

  const main = document.querySelector(".main");
  main.innerHTML = `
    <h2>${projectName}</h2>
    <input type="text" id="taskInput" placeholder="New task">
    <button onclick="addTask()">Create Task</button>

    <div class="board">
      <div class="column" id="todo" ondrop="drop(event)" ondragover="allowDrop(event)">
        <h3>To Do</h3>
      </div>
      <div class="column" id="doing" ondrop="drop(event)" ondragover="allowDrop(event)">
        <h3>In Progress</h3>
      </div>
      <div class="column" id="done" ondrop="drop(event)" ondragover="allowDrop(event)">
        <h3>Done</h3>
      </div>
    </div>
  `;

  renderTasks();
}

function renderTasks() {
  const projects = JSON.parse(localStorage.getItem("projects") || "{}");
  const data = projects[currentProject];

  for (let column of ["todo", "doing", "done"]) {
    const col = document.getElementById(column);
    col.innerHTML = `<h3>${column === "todo" ? "To Do" : column === "doing" ? "In Progress" : "Done"}</h3>`;
    data[column].forEach((taskText, index) => {
      const task = createTaskElement(taskText, column, index);
      col.appendChild(task);
    });
  }
}

function createTaskElement(text, column, index) {
  const div = document.createElement("div");
  div.className = "task";
  div.draggable = true;
  div.id = `${column}-${index}`;
  div.ondragstart = dragStart;
  div.innerText = text;
  return div;
}

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const text = taskInput.value.trim();
  if (!text) return;

  let projects = JSON.parse(localStorage.getItem("projects") || "{}");
  projects[currentProject].todo.push(text);
  localStorage.setItem("projects", JSON.stringify(projects));
  taskInput.value = "";
  renderTasks();
}

function allowDrop(event) {
  event.preventDefault();
}

function dragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.id);
}

function drop(event) {
  event.preventDefault();
  const taskId = event.dataTransfer.getData("text/plain");
  const [fromColumn, indexStr] = taskId.split("-");
  const index = parseInt(indexStr);
  const toColumn = event.currentTarget.id;

  if (!["todo", "doing", "done"].includes(toColumn)) return;

  let projects = JSON.parse(localStorage.getItem("projects") || "{}");
  const taskText = projects[currentProject][fromColumn].splice(index, 1)[0];
  projects[currentProject][toColumn].push(taskText);
  localStorage.setItem("projects", JSON.stringify(projects));
  renderTasks();
}

window.onload = loadProjectList;

