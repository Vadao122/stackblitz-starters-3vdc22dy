import Linker from './sqlite.js'; // подкшлючаем Linker из файла sqlite.js

async function exec(sql) {
  // создаем ассинхронную фун-ю exec и она получает парметр sql
  if (typeof sql !== 'string' || sql.trim().length === 0) {
    // если(тип переменной sql не явялется строкой ИЛИ sql явялется пустой строкой, то выполняем код внутри if)
    throw new Error('This migration failed the validation!'); // остановить выполенение и вывести ошибку
  }
  let linker; // создаем переменную linker
  try {
    // выполняет код, если возникает ошибка переходит на catch
    linker = new Linker('./database.db'); // создаем объект класса Linker и говорим, что хочем работать с бд database.db
    await linker.connect(); // ждем пока подлючится к бд
    return await linker.run(sql); // возвращает выполнение метода run из sqlite.js
  } catch (err) {
    // если в try произошла ошибка, то выполняем код внутри
    console.log(err); // выводим ошибку в консоль
    throw new Error('This migration is failed. Try with another sql.'); // создаем новую ошибку, вместо ошибки рограмма выдаст сообщение в скобках
  } finally {
    // выполняется в любом случае
    await linker.close(); // закрываем бд
  }
}

async function up(sql) {
  // создаем фун-ю up (применить изменения)
  await exec(sql); // передаем sql в exec
}

async function down(sql) {
  // создаем фун-ю down (отменить изменения)
  await db.exec(sql); // передаем sql в exec
}

export { up, down }; // экспорт функций, разрешаем другим файлам использовать эти функции
