//Генерируем массив задач
const taskArr = genTasksArray(4);

//С обычным массивом удобней работать, т.к. ассоциативные массивы сортируются
//по ключам в алфавитном порядке, что вносит некоторую путанницу в выдачу, и
//требует дополнительной сортировки. Приимущества в поиске эллемента по ключу
//нивелируются сложностями с порядком выдачи, или генерацией ID попорядку.

// const taskMap = taskArr.reduce((acc, task) => {
//   acc[task._id] = task;
//   return acc;
// }, []);

//ШАБЛОН для вывода задачи в <li> с кнопочками выполненно и удалить, и прочими
//элементами управления
function tmpTaskItemLi(task, index) {
  //ID задачи кидаем в data-task-id
  const liTask = document.createElement("li");
  liTask.dataset.taskId = task._id;
  liTask.dataset.taskCompleted = task.completed;
  liTask.className = "list-group-item list-group-item-action flex-column";

  const divTaskHeader = document.createElement("div");
  divTaskHeader.className = "d-flex w-100 justify-content-between";

  //Название задачи в <H5>
  const h5Task = document.createElement("h5");
  h5Task.className = "mb-1";
  h5Task.textContent = `${index + 1}. ${task.title}`;

  const divBtn = document.createElement("div");

  const btnComleted = document.createElement("button");
  btnComleted.type = "Button";
  btnComleted.className = "btn btn-sm";
  btnComleted.textContent = "Completed";

  const btnDeleted = document.createElement("button");
  btnDeleted.type = "Button";
  btnDeleted.className = "btn btn-danger btn-sm ml-1";
  btnDeleted.textContent = "Delete";

  const divSpec = document.createElement("div");

  //Описание задачи в <P>
  const pSpec = document.createElement("p");
  pSpec.className = "mb-1";
  pSpec.textContent = task.specification;

  //Выделить выполненные <class>//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  if (task.completed) {
    liTask.classList.add("list-group-item-info");
    // liTask.classList.add("to-comleted");
    btnComleted.classList.add("btn-light");
  } else {
    liTask.classList.add("align-items-start");
    // liTask.classList.add("to-not-comleted");
    btnComleted.classList.add("btn-secondary");
  }

  //События
  btnDeleted.addEventListener("click", onRemoveEl);
  btnComleted.addEventListener("click", onCompletedEl);

  //Вкладываю дочерние в родительские
  divBtn.appendChild(btnComleted);
  divBtn.appendChild(btnDeleted);

  divTaskHeader.appendChild(h5Task);
  divTaskHeader.appendChild(divBtn);

  divSpec.appendChild(pSpec);

  liTask.appendChild(divTaskHeader);
  liTask.appendChild(divSpec);

  return liTask;
}

//ШАБЛОН для вывода нескольких задач из переданного массива в <ul>

//Не создаю дополнительный массив для сортировки, сортирую прямо при выдачи.
//Можно спорить хороший ли это вариант, но я подумал так проще реализовать:
//отдал в нужном порядке в документ все остальное поведения реализовал
//в событиях.
//Еще вариант: можно отдавать отсортированный массив, но тогда нужно добавить
//поле с порядковым номером задачи, т.к. индекс будет менятся. Или использовать
//ассоциированый массив, как предпологалось в начале, c полем Номер по порядку.
//И следить что бы это поле правильно заполнялось.
function tmpTasksListUl(
  taskArr,
  { activePage = "All", sortByNumber, sortByCompleted }
) {
  const ulTasks = document.createElement("ul");
  ulTasks.id = "tasksList";
  ulTasks.className = "list-group";

  //Если НУЖНА сортировка по Comleted
  if (sortByCompleted) {
    //Список ВЫПОЛНЕННЫХ задач выводим
    for (let i = 0; i < taskArr.length; i++)
      if (!taskArr[i].completed)
        if (sortByNumber)
          //Порядок выведения A-Z или Z-A
          ulTasks.insertAdjacentElement(
            "beforeend",
            tmpTaskItemLi(taskArr[i], i)
          );
        else
          ulTasks.insertAdjacentElement(
            "afterbegin",
            tmpTaskItemLi(taskArr[i], i)
          );
    //Список НЕ ВЫПОЛНЕННЫХ задач выводим
    for (let i = 0; i < taskArr.length; i++)
      if (taskArr[i].completed)
        if (sortByNumber)
          //Порядок выведения A-Z или Z-A
          ulTasks.insertAdjacentElement(
            "beforeend",
            tmpTaskItemLi(taskArr[i], i)
          );
        else
          ulTasks.insertAdjacentElement(
            "afterbegin",
            tmpTaskItemLi(taskArr[i], i)
          );
  }
  //Если НЕ НУЖНА сортировка по Comleted
  //Выводим все подряд задачи
  else
    for (let i = 0; i < taskArr.length; i++)
      //Порядок выведения A-Z или Z-A
      if (sortByNumber)
        ulTasks.insertAdjacentElement(
          "beforeend",
          tmpTaskItemLi(taskArr[i], i)
        );
      else
        ulTasks.insertAdjacentElement(
          "afterbegin",
          tmpTaskItemLi(taskArr[i], i)
        );
  return ulTasks;
}

//ШАБЛОН переключателя отображения ALL/COMPLETED/...
function tmplateTaskViewUl(
  arrLiNameStr = ["All", "Completed"],
  { sortByNumber, sortByCompleted }
) {
  const divTaskView = document.createElement("div");
  divTaskView.style.display = "flex";

  const divPageControl = document.createElement("div");
  divPageControl.id = "pageControl";
  divPageControl.className = "pl-1 pr-1";

  const ulPageControl = document.createElement("ul");
  ulPageControl.className = "nav nav-tabs";
  ulPageControl.style.borderBottom = "0px";

  for (const liNameStr of arrLiNameStr) {
    const liPage = document.createElement("li");
    liPage.className = "nav-item";
    const aPage = document.createElement("a");
    aPage.href = "#!";
    aPage.className = "nav-link";
    aPage.textContent = liNameStr;

    //События
    aPage.addEventListener("click", onSwitchPageEl);
    liPage.appendChild(aPage);
    ulPageControl.appendChild(liPage);
  }

  divPageControl.appendChild(ulPageControl);
  divTaskView.appendChild(divPageControl);

  //Кнопки сортировки
  const divSort = document.createElement("div");
  divSort.className = "btn-group btn-group-sm mb-2";
  divSort.style.marginLeft = "auto";

  const btnSortAZ = document.createElement("button");
  btnSortAZ.type = "Button";
  btnSortAZ.className = "btn btn-light";
  btnSortAZ.textContent = "№ ";

  const btnSortComp = document.createElement("button");
  btnSortComp.type = "Button";
  btnSortComp.className = "btn btn-light";
  btnSortComp.textContent = "Completed ";
  //Класс если включена сортировка Completed
  if (sortByCompleted) btnSortComp.classList.add("active");

  const icnSort = document.createElement("i");
  icnSort.className = "fas fa-arrow-down";
  //Класс по включеной сортировке A-z или Z-a
  if (!sortByNumber) icnSort.classList.toggle("turn");

  btnSortAZ.appendChild(icnSort);
  divSort.appendChild(btnSortAZ);
  divSort.appendChild(btnSortComp);
  divTaskView.appendChild(divSort);

  //События кнопок сортировки
  btnSortAZ.addEventListener("click", onSortAZ);
  btnSortComp.addEventListener("click", onSortComp);

  return divTaskView;
}

//ШАБЛОН Сообщение что нет записей
function tmpMessageP(msgStr) {
  const pMessage = document.createElement("p");
  pMessage.className = "list-group-item list-group-item-info";
  pMessage.textContent = msgStr;
  //Сбросим Активную страницу
  taskView.activePage = "All";
  return pMessage;
}

//Рендер элементов для Контейнера
function renderHTML(
  taskArr,
  { activePage = "All", sortByNumber, sortByCompleted }
) {
  //наш контейнер, удаляем содержимое
  const divContainer = document.querySelector("#Container");
  while (divContainer.childElementCount > 0) divContainer.firstChild.remove();

  //если задачь есть то показываем их
  if (taskArr.length) {
    //верхняя панель с нашими настройками отображения
    divContainer.appendChild(
      tmplateTaskViewUl(["All", "Completed", "Not completed"], {
        activePage,
        sortByNumber,
        sortByCompleted
      })
    );
    //Выводим список задач
    divContainer.appendChild(
      tmpTasksListUl(taskArr, { activePage, sortByNumber, sortByCompleted })
    );
    //Выделить активную вкладку, сымитировав по ней onClick
    const aPages = document.querySelector("#pageControl").querySelectorAll("a");
    aPages.forEach(el => {
      if (el.textContent.toUpperCase() === activePage.toUpperCase()) el.click();
    });
    //если нет задачь - выводим сообщение
  } else divContainer.appendChild(tmpMessageP("No tasks..."));
}

//---------------------------------------------------------------

//Событие добавления объекта
function onAddNewEl(el) {
  el.stopPropagation();
  const titleTask = document.querySelector("#InputTaskTitle").value;
  const SpecTask = document.querySelector("#InputTaskSpecification").value;
  const CompTask = document.querySelector("#CheckCompleted").checked;
  const idTask = genID(); //генератор ID из taskGenerator.js
  const task = {
    _id: idTask,
    title: titleTask,
    specification: SpecTask,
    completed: CompTask
  };
  document.forms[0].reset();

  taskArr.push(task);
  renderHTML(taskArr, taskView); //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
}

//Событие удаления <li> и из массива
function onRemoveEl(el) {
  el.stopPropagation();
  const { target } = el;
  const parent = target.closest("[data-task-id]");
  const id = parent.dataset.taskId;
  parent.remove();
  taskArr.splice(taskArr.map(el => el._id).indexOf(id), 1);
  renderHTML(taskArr, taskView);
}

//Событие выполненное/не выполненное
function onCompletedEl(el) {
  el.stopPropagation();
  const { target } = el;
  const parent = target.closest("[data-task-id]");
  const id = parent.dataset.taskId;
  taskArr[taskArr.map(el => el._id).indexOf(id)].completed = !taskArr[
    taskArr.map(el => el._id).indexOf(id)
  ].completed;
  renderHTML(taskArr, taskView);
}

//Переключить видимость
function onSwitchPageEl(el) {
  el.stopPropagation();
  const { target } = el;
  // const parent = target.closest("ul");

  [...document.querySelectorAll("a")].forEach(e =>
    e.classList.remove("active")
  );
  target.classList.add("active");

  switch (target.textContent.toUpperCase()) {
    case "ALL":
      document
        .querySelectorAll("[data-task-completed]")
        .forEach(el => (el.style.display = "block"));
      break;
    case "COMPLETED":
      document.querySelectorAll("[data-task-completed]").forEach(el => {
        if (el.dataset.taskCompleted === "true") el.style.display = "block";
        else el.style.display = "none";
      });
      break;
    case "NOT COMPLETED":
      document.querySelectorAll("[data-task-completed]").forEach(el => {
        if (el.dataset.taskCompleted === "false") el.style.display = "block";
        else el.style.display = "none";
      });
      break;
  }
  taskView.activePage = target.textContent;
}

//Сортировка AZ или ZA
function onSortAZ() {
  taskView.sortByNumber = !taskView.sortByNumber;
  renderHTML(taskArr, taskView);
}
//Сортировка Completed
function onSortComp() {
  taskView.sortByCompleted = !taskView.sortByCompleted;
  renderHTML(taskArr, taskView);
}

//---------------------------------------------------------------

const taskView = {
  activePage: "All",
  sortByNumber: true,
  sortByCompleted: true
};

//Стиль .turn развернутой на 180' стрелочки
const icnTurn = document.createElement("style");
icnTurn.type = "text/css";
icnTurn.append(".turn { transform: rotate(180deg); }");
document.head.appendChild(icnTurn);

//Событие создание нового задания
const btnAdd = document.querySelector("#AddNewTask");
btnAdd.addEventListener("click", onAddNewEl);

//Перерисовка элементов экрана
renderHTML(taskArr, taskView);
