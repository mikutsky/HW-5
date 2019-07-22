//Мой Генератор ID
const genID = () => {
  let result = Math.random()
    .toString(16)
    .slice(2, 14);
  while (result.length < 12) result = "0" + result;
  return result;
};

//Мой генератор текста
const genStr = (strLength = 1) => {
  if (typeof strLength != "number" || strLength < 1 || strLength > 64)
    return console.error("genStr(): Argument is wrong.");
  let result = "";

  //Словарь для генерации текста
  const arrLorem = (
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis tempora, " +
    "qui laudantium rem assumenda fugiat esse tempore, eos beatae aperiam " +
    "perferendis obcaecati reiciendis. Vel dolorum natus ratione distinctio cum " +
    "officia?"
  ).split(" ");
  //Знаки припинания
  const arrPunct = ". ! ? ... ?! !!! :) ;)".split(" ");
  //Буквы
  const arrABC = (
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz"
  ).split("");

  //Добавляем нужное кол-во слов в result
  for (let i = 0; i < strLength; i++)
    result += arrLorem[Math.floor(Math.random() * arrLorem.length)] + " ";

  //Первая буква заглавная
  result = result[0].toUpperCase() + result.slice(1);
  //Убираем знаки припинания и пробелы в конце строки
  while (
    arrABC.every(el => el !== result[result.length - 1]) ||
    result[result.length - 1] === " "
  )
    result = result.slice(0, -1);

  //Добавляем знак припинания в конец строки и возвращаем сгенерированную строку
  result += arrPunct[Math.floor(Math.random() * arrPunct.length)];
  return result;
};

//Мой генератор массива заданий
const genTasksArray = (taskCount = 1) => {
  const resultArr = [];
  for (i = 0; i < taskCount; i++)
    resultArr[i] = {
      _id: genID(),
      title: genStr(Math.floor(Math.random() * 3) + 2),
      specification: genStr(Math.floor(Math.random() * 22) + 10),
      completed: Math.random() * 10 < 4 //примерно 40% заданий выполненные уже
    };
  return resultArr;
};
