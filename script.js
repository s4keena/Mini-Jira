function addTask() {
    const taskText = document.getElementById("task").value;
    if (taskText.trim()) {
      const div = document.createElement("div");
      div.className = "task";
      div.draggable = true;
      div.id = "task-" + Date.now();
      div.addEventListener("dragstart", dragStart);
  
      const span = document.createElement("span");
      span.innerText = taskText;
  
      const deleteBtn = document.createElement("button");
      deleteBtn.innerText = "✖";
      deleteBtn.className = "delete-btn";
      deleteBtn.onclick = () => div.remove();
  
      div.appendChild(span);
      div.appendChild(deleteBtn);
  
      document.getElementById("todo").appendChild(div);
      document.getElementById("task").value = "";
    }
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
    const task = document.getElementById(taskId);
    event.currentTarget.appendChild(task);
  }
  