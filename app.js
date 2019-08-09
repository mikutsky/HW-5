const arrOfTasks = [
  {
    _id: "5d2ca9e2e03d40b326596aa7",
    completed: true,
    body:
      "Occaecat non ea quis occaecat ad culpa amet deserunt incididunt elit fugiat pariatur. Exercitation commodo culpa in veniam proident laboris in. Excepteur cupidatat eiusmod dolor consectetur exercitation nulla aliqua veniam fugiat irure mollit. Eu dolor dolor excepteur pariatur aute do do ut pariatur consequat reprehenderit deserunt.\r\n",
    title: "Eu ea incididunt sunt consectetur fugiat non."
  },
  {
    _id: "5d2ca9e29c8a94095c4e88e0",
    completed: false,
    body:
      "Aliquip cupidatat ex adipisicing veniam do tempor. Lorem nulla adipisicing et esse cupidatat qui deserunt in fugiat duis est qui. Est adipisicing ipsum qui cupidatat exercitation. Cupidatat aliqua deserunt id deserunt excepteur nostrud culpa eu voluptate excepteur. Cillum officia proident anim aliquip. Dolore veniam qui reprehenderit voluptate non id anim.\r\n",
    title:
      "Deserunt laborum id consectetur pariatur veniam occaecat occaecat tempor voluptate pariatur nulla reprehenderit ipsum."
  }
];

//Модуль для работы со списком задач
function InitTasks(arrOfTasks = []) {
  const list = arrOfTasks.reduce((acc, el) => {
    acc[el._id] = el;
    return acc;
  }, {});
  return {
    //методы
    addTask: (title, body, completed) => {
      const newTask = {
        title,
        body,
        completed,
        _id: (
          Array(12).join("0") +
          Math.random()
            .toString(16)
            .slice(2)
        ).slice(-12)
      };
      list[newTask._id] = newTask;
      return { ...newTask };
    },

    remove: id => {
      delete list[id];
      return id;
    },

    switchcompleted: (id, completed = !list[id].completed) => {
      list[id].completed = completed;
    },

    length: () => Object.keys(list).length,

    //Массив задач
    list
  };
}

//Модуль для работы с интерфесом документа
function InitRenderUI(parent) {
  let visiblecompleted = true;

  function listItemTemplate(task) {
    const li = document.createElement("li");
    li.classList.add(
      "list-group-item",
      "align-items-center",
      "flex-wrap",
      "list-group-item-action",
      "d-flex"
    );
    li.setAttribute("data-task-id", task._id);
    li.setAttribute("completed", task.completed);
    if (task.completed) li.classList.add("list-group-item-info");
    if (task.completed && !visiblecompleted) toggleItemDisplay(li);

    const span = document.createElement("span");
    span.textContent = task.title;
    span.style.fontWeight = "bold";
    span.style.maxWidth = "860px";

    const CompletedBtn = document.createElement("button");
    CompletedBtn.textContent = "Completed";
    CompletedBtn.classList.add("btn", "btn-info", "ml-auto", "completed-btn");
    CompletedBtn.addEventListener("click", el => {
      const liParent = el.target.closest("[data-task-id]");
      const liTask = tasks.list[liParent.dataset.taskId];
      tasks.switchcompleted(liTask._id);
      li.setAttribute("completed", task.completed);
      liParent.classList.toggle("list-group-item-info");
      if (liTask.completed && !visiblecompleted) toggleItemDisplay(liParent);
      sortedAppendLi(parent.querySelectorAll("[data-task-id]"));
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("btn", "btn-danger", "ml-2", "delete-btn");
    deleteBtn.addEventListener("click", el => {
      const liParent = el.target.closest("[data-task-id]");
      tasks.remove(liParent.dataset.taskId);
      liParent.remove();
      checkListEmply();
    });

    const article = document.createElement("p");
    article.textContent = task.body;
    article.classList.add("mt-2", "w-100");

    li.appendChild(span);
    li.appendChild(CompletedBtn);
    li.appendChild(deleteBtn);
    li.appendChild(article);
    return li;
  }

  function checkListEmply() {
    const divWarning = document.querySelector("#warning-list-empty");
    const divViewSet = document.querySelector("#panel-view-settings");
    divWarning.classList.add("d-none");
    divViewSet.classList.remove("d-none");

    if (parent.childElementCount === 0) {
      divWarning.classList.toggle("d-none");
      divViewSet.classList.toggle("d-none");
    }
  }

  function sortedAppendLi(liAll, container = parent) {
    liAll.forEach(el => {
      if (tasks.list[el.dataset.taskId].completed) container.appendChild(el);
      else
        container.insertBefore(
          el,
          container.querySelector('li[completed="true"]')
        );
    });
  }

  function toggleItemDisplay(li) {
    li.classList.toggle("d-flex");
    li.classList.toggle("d-none");
  }

  return {
    //методы
    addTaskList: objOfTasks => {
      const fragment = document.createDocumentFragment();
      Object.values(objOfTasks).forEach(task => {
        sortedAppendLi([listItemTemplate(task)], fragment);
      });
      parent.appendChild(fragment);
      checkListEmply();
    },

    addItem: task => {
      sortedAppendLi([listItemTemplate(task)]);
      checkListEmply();
    },

    switchView: (visible = !visiblecompleted) => {
      if (visible === visiblecompleted) return;
      const liAll = parent.querySelectorAll('li[completed="true"]');
      liAll.forEach(li => {
        toggleItemDisplay(li);
      });
      visiblecompleted = visible;
    }
  };
}

//Инициализируем модули и выводим список задач
const ul_tasks = document.querySelector(".tasks-list-section .list-group");
const form_add = document.querySelector('form[name="add-task"]');
const renderUI = InitRenderUI(ul_tasks);
const tasks = InitTasks(arrOfTasks);
renderUI.addTaskList(tasks.list);

//События Submit формы
form_add.addEventListener("submit", el => {
  el.preventDefault();
  const title = document.querySelector("#title").value;
  const body = document.querySelector("#body").value;
  const completed = document.querySelector("#completed").checked;
  if (!title || !body)
    return alert("Enter some values in the title and body fields, please!");
  renderUI.addItem(tasks.addTask(title, body, completed));
  el.target.closest("form").reset();
});

//События кнопок отображения
document.querySelectorAll("#panel-view-settings button").forEach(button =>
  button.addEventListener("click", el => {
    if (el.target.name === "view-all") renderUI.switchView(true);
    if (el.target.name === "view-uncompleted") renderUI.switchView(false);
  })
);
