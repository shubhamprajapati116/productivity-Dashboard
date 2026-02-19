const downarrow = document.querySelectorAll(".downarrow");
const sections = document.querySelector(".sections");
const dashdarkicon = document.querySelector(".darkmode-icon");
const darkmodeswitch = document.querySelector(".darkcheckbox");
const container = document.querySelector(".container");

const addtaskbtnn = document.getElementById("addtaskbtn");

const tasklist = document.querySelector(".tasklist");
const priorityselect = document.querySelector(".filter-priority");
const categoryselect = document.querySelector(".filter-category");
const statusselect = document.querySelector(".filter-status");
const counttasks = document.querySelector(".taskcounts");
const completionratebox = document.querySelector(".completionrate");
const page = document.body.dataset.page;

function gettask() {
  return JSON.parse(localStorage.getItem("tasks") || "[]");
}

function savetask(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

downarrow.forEach((arrow) => {
  arrow.addEventListener("click", () => {
    let isclosed = arrow.classList.toggle("close");
    if (isclosed) {
      sections.classList.add("closee");
    } else {
      sections.classList.remove("closee");
    }
  });
});
dashdarkicon.addEventListener("click", () => {
  let isdarkmode = container.classList.toggle("open");
  localStorage.setItem("darkmode", isdarkmode);
  if (darkmodeswitch) {
    darkmodeswitch.checked = isdarkmode;
  }
});

let localvl = localStorage.getItem("darkmode");
if (localvl === "true") {
  container.classList.add("open");
}
if (darkmodeswitch) {
  darkmodeswitch.checked = localvl === "true";
  darkmodeswitch.addEventListener("change", () => {
    container.classList.toggle("open", darkmodeswitch.checked);
    localStorage.setItem("darkmode", darkmodeswitch.checked);
  });
}
function rendertask(task) {
  if (tasklist) {
    const taskdiv = document.createElement("div");

    taskdiv.className = "task-item";
    taskdiv.dataset.id = task.id;
    taskdiv.innerHTML = `
    <div class="content">
  <img src="./assets/images/task.png" alt="today task logo">
  <strong class="task-title">${task.title}</strong>
  <p>${task.category}</p>
  </div>
  <div class="actions">
  <p>${task.status}</p>
  <p>${task.priority}</p>
  ${
    task.status === "pending"
      ? `<button class="completed-btn">complete</button>`
      : `<span class="done">done</span>`
  }
  <img src="./assets/images/deldetbtn.png" alt="delet logo" class="tasklistdelet" />
  </div>
  `;
    tasklist.appendChild(taskdiv);
  }
}
function initTaskEvents() {
  if (addtaskbtnn) {
    addtaskbtnn.addEventListener("click", handleaddTask);
  }

  if (tasklist) {
    tasklist.addEventListener("click", handleTaskAction);
  }
}

function handleaddTask(e) {
  e.preventDefault();
  const titleInput = document.querySelector(".titletask");
  const priority = document.querySelector(".priority");
  const category = document.querySelector(".category");
  if (titleInput.value.trim() === "") {
    alert("Title is required");
    return;
  } else if (priority.value === "") {
    alert("priority is required");
    return;
  } else if (category.value === "") {
    alert("category is required");
    return;
  }
  const task = {
    title: document.querySelector(".titletask").value,
    priority: document.querySelector(".priority").value,
    category: document.querySelector(".category").value,
    id: Date.now(),
    status: "pending",
    taskstart: Date.now(),
    endtime: null,
    date: new Date().toISOString().split("T")[0],
  };

  let tasks = gettask();
  tasks.push(task);
  savetask(tasks);
  rendertask(task);
}
function handleTaskAction(e) {
  if (e.target.classList.contains("completed-btn")) {
    const taskitem = e.target.closest(".task-item");

    const id = Number(taskitem.dataset.id);
    let tasks = gettask();
    tasks = tasks.map((task) => {
      if (task.id === id) {
        task.status = "completed";
        task.endtime = Date.now();
      }
      return task;
    });
    savetask(tasks);
    tasklist.innerHTML = "";
    tasks.forEach(rendertask);
  }

  if (e.target.classList.contains("tasklistdelet")) {
    const taskitem = e.target.closest(".task-item");
    const id = Number(taskitem.dataset.id);
    taskitem.remove();
    let tasks = gettask();
    tasks = tasks.filter((task) => task.id != id);
    savetask(tasks);
  }
}
function filtertask() {
  const priority = priorityselect.value;
  const category = categoryselect.value;
  const status = statusselect.value;

  const tasks = gettask();
  tasklist.innerHTML = "";
  const filterdtask = tasks.filter((task) => {
    const filterdpriority = priority === "" || task.priority === priority;
    const filterdcategory = category === "" || task.category === category;
    const filterdstatus = status === "" || task.status === status;
    return filterdpriority && filterdcategory && filterdstatus;
  });
  filterdtask.forEach(rendertask);
}
if (priorityselect && categoryselect && statusselect) {
  priorityselect.addEventListener("change", filtertask);
  categoryselect.addEventListener("change", filtertask);
  statusselect.addEventListener("change", filtertask);
}
window.addEventListener("DOMContentLoaded", () => {
  const tasks = gettask();
  tasks.forEach(rendertask);
});
if (page === "dashboard") {
  const bars = document.querySelectorAll(".chart div");
  let tasks = gettask();
  let todaydate = new Date().toISOString().split("T")[0];
  const taskduelist = document.querySelector(".taskdue");
  let count = 0;
  let compltedtodaytask = 0;

  tasks.forEach((task) => {
    if (task.date === todaydate) {
      const dashtodaytask = document.createElement("div");
      dashtodaytask.className = "dashboardtask";
      dashtodaytask.innerHTML = `
      <div class="titleimg">
       <img src="./assets/images/clock (1).png" alt="clock logo" />
      <span class="title">${task.title}</span>
      </div>
      <div class="taskinfo">
      <span class="category">${task.category}</span>
      <span class="priority">${task.priority}</span>
      <span>${task.date}</span>
      </div>
      `;
      taskduelist.appendChild(dashtodaytask);
      count++;
      if (task.status === "completed") {
        compltedtodaytask++;
      }
    }
  });

  counttasks.textContent = count;
  let completionrate = 0;
  if (count > 0) {
    completionrate = Math.round((compltedtodaytask / count) * 100);
  }
  if (completionratebox) {
    completionratebox.textContent = `${completionrate}%`;
  }

  let totalfocusms = 0;

  tasks.forEach((task) => {
    if (
      task.date === todaydate &&
      task.status === "completed" &&
      task.endtime
    ) {
      totalfocusms += task.endtime - task.taskstart;
    }
  });
  let totakminute = Math.floor(totalfocusms / 60000);
  let totalsec = Math.floor((totalfocusms % 60000) / 1000);
  let hours = Math.floor(totakminute / 60);
  let minutes = totakminute % 60;
  const focusbox = document.querySelector(".focustime");
  if (focusbox) {
    focusbox.textContent = `${hours}H ${minutes}m ${totalsec}s`;
  }
  let weeklydata = {};
  let today = new Date();

  for (let i = 6; i >= 0; i--) {
    let date = new Date();
    date.setDate(today.getDate() - i);

    let formatteddate = date.toISOString().split("T")[0];
    weeklydata[formatteddate] = 0;
  }

  tasks.forEach((task) => {
    if (task.status === "completed" && weeklydata.hasOwnProperty(task.date)) {
      weeklydata[task.date]++;
    }
  });

  let weeklyEntries = Object.entries(weeklydata);

  weeklyEntries.forEach(([dateKey, count], index) => {
    const bar = bars[index];

    const height = count > 0 ? count * 15 : 6;
    bar.style.height = height + "px";
  });
}

if (page === "analytics") {
  let today = new Date();
  let tasks = gettask();
  const daybars = document.querySelectorAll(".charts-wrapper > div");

  let weekdata = {};

  for (let i = 6; i >= 0; i--) {
    let date = new Date();
    date.setDate(today.getDate() - i);
    let key = date.toISOString().split("T")[0];
    weekdata[key] = { planned: 0, completed: 0 };
  }

  tasks.forEach((task) => {
    if (weekdata[task.date]) {
      weekdata[task.date].planned++;
      if (task.status === "completed") {
        weekdata[task.date].completed++;
      }
    }
  });
  let weekEntries = Object.entries(weekdata);

  weekEntries.forEach(([key, day], index) => {
    const container = daybars[index];
    if (!container) return;

    const plannedbar = container.querySelector(".first-bar");
    const completedbar = container.querySelector(".second-bar");

    const plannedHeight = day.planned > 0 ? day.planned * 10 : 9;
    const completedHeight = day.completed > 0 ? day.completed * 10 : 9;

    plannedbar.style.height = plannedHeight + "px";
    completedbar.style.height = completedHeight + "px";

    const dayName = new Date(key).toLocaleDateString();

    const tooltip = document.createElement("div");
    tooltip.className = "bar-tooltip";
    tooltip.innerHTML = `
    <strong>${dayName.toUpperCase()}</strong><br>
    Planned: ${day.planned}<br>
    Completed: ${day.completed}
  `;

    container.appendChild(tooltip);
  });
}
