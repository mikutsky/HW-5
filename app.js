//Генерируем массив задач
const tasksArr = genTaskArray(4).reduce((acc, task) => {
  acc[task._id] = task;
  return acc;
}, []);

//Шаблон для вывода задачи в <li> с кнопочками выполненно и удалить
function templateTaskItemLi(task) {
  const liTask = document.createElement("li");
  liTask.dataset.taskId = "teskId-" + task._id;
  liTask.dataset.taskCompleted = task.completed;
  liTask.className = "list-group-item list-group-item-action flex-column";

  const divTaskHeader = document.createElement("div");
  divTaskHeader.className = "d-flex w-100 justify-content-between";

  //Название задачи
  const h5Task = document.createElement("h5");
  h5Task.className = "mb-1";
  h5Task.textContent = task.title;

  const divBtn = document.createElement("div");

  const btnComleted = document.createElement("button");
  btnComleted.type = "Button";
  btnComleted.textContent = "Completed";

  const btnDeleted = document.createElement("button");
  btnDeleted.type = "Button";
  btnDeleted.className = "btn btn-danger btn-sm ml-1";
  btnDeleted.textContent = "Delete";

  const divSpec = document.createElement("div");

  //Описание задачи
  const pSpec = document.createElement("p");
  pSpec.className = "mb-1";
  pSpec.textContent = task.specification;

  //Выделить выполненные
  if (task.completed) {
    liTask.classList.add("list-group-item-info");
    btnComleted.className = "btn btn-light btn-sm";
  } else {
    liTask.classList.add("align-items-start");
    btnComleted.className = "btn btn-secondary btn-sm";
  }

  divBtn.appendChild(btnComleted);
  divBtn.appendChild(btnDeleted);

  divTaskHeader.appendChild(h5Task);
  divTaskHeader.appendChild(divBtn);

  divSpec.appendChild(pSpec);

  liTask.appendChild(divTaskHeader);
  liTask.appendChild(divSpec);

  btnDeleted.addEventListener("click", removeEl);

  return liTask;
}
console.log(tasksArr);

//Шаблон для вывода нескольких задач в <ul>
function templateTasksUl(tasksArr) {
  const fragment = document.createDocumentFragment();
  const ulTasks = document.createElement("ul");
  ulTasks.id = "tasksList";
  ulTasks.className = "list-group";

  const divPageControl = document.createElement("div");
  divPageControl.className = "pl-1 pr-1";

  const ulPageControl = document.createElement("ul");
  ulPageControl.className = "nav nav-tabs";
  ulPageControl.style.borderBottom = "0px";

  const liAll = document.createElement("li");
  liAll.className = "nav-item";

  const liCompleted = document.createElement("li");
  liCompleted.className = "nav-item";

  const aAll = document.createElement("a");
  aAll.href = "#!";
  aAll.className = "nav-link active";
  aAll.textContent = "All";

  const aCompleted = document.createElement("a");
  aCompleted.href = "#!";
  aCompleted.className = "nav-link";
  aCompleted.textContent = "Completed";

  liAll.appendChild(aAll);
  liCompleted.appendChild(aCompleted);
  ulPageControl.appendChild(liAll);
  ulPageControl.appendChild(liCompleted);

  divPageControl.appendChild(ulPageControl);

  for (const id in tasksArr)
    if (tasksArr[id].completed)
      ulTasks.insertAdjacentElement(
        "afterbegin",
        templateTaskItemLi(tasksArr[id])
      );
    else
      ulTasks.insertAdjacentElement(
        "beforeend",
        templateTaskItemLi(tasksArr[id])
      );

  fragment.appendChild(divPageControl);
  fragment.appendChild(ulTasks);

  return fragment;
}

//Сообщение что нет записей
function templateMessage(msgStr) {
  const pMessage = document.createElement("p");
  pMessage.className = "list-group-item list-group-item-info";
  pMessage.textContent = msgStr;
  return pMessage;
}

//Рендер элементов
function renderHTML() {
  const divContainer = document.querySelector("#Container");
  while (divContainer.firstChild) divContainer.firstChild.remove();

  if (!tasksArr) divContainer.appendChild(templateMessage("No tasks..."));
  else divContainer.appendChild(templateTasksUl(tasksArr));
}

//Событие добавления объекта
function AddNewEl() {
  const titleTask = document.querySelector("#InputTaskTitle").value;
  const SpecTask = document.querySelector("#InputTaskSpecification").value;
  const CompTask = document.querySelector("#CheckCompleted").checked;
  const idTask = genID();
  const task = {
    _id: idTask,
    title: titleTask,
    specification: SpecTask,
    completed: CompTask
  };

  tasksArr[task._id] = task;
  renderHTML();
}

const btnAdd = document.querySelector("#AddNewTask");
btnAdd.addEventListener("click", AddNewEl);
renderHTML();

//Событие удаления li
function removeEl(el) {
  const { target } = el;
  const parent = target.closest("[data-task-id]");
  const id = parent.dataset.taskId;
  parent.remove();
  delete tasksArr[id];
}
//Событие выполненное
//Событие не выполненное
//Сортровка по выполненным/не выполненным
