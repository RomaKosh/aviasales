const formSearch = document.querySelector('.form-search'),
      inputCitiesFrom = document.querySelector('.input__cities-from'),
      dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
      inputCitiesTo = document.querySelector('.input__cities-to'),
      dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
      inputDateDepart = document.querySelector('.input__date-depart');

const city = ['Сватове', 'Купянск', 'Старобельск', 'Северодонецк', 'Лисичанск', 'Рубежное', 'Харьков', 'Луганск', 'Киев', 'Одесса', 'Днепр', 'Житомыр', 'Красный Луч', 'Ростов-на-Дону', 'Москва', 'Львов', 'Варшава', 'Вроцлав', 'Берлин', 'Вронки', 'Познань', 'Донецк', 'Полтава', 'Изюм', 'Борова', 'Станица'];

const showCity = (input, list) => {   
  list.textContent = '';              //Очищаем список перед каждым вводом

  if (input.value === '') return;

  const filterCity = city.filter((item) => {        //Фильтруем массив city
    const fixItem = item.toLowerCase();             //Переводим к нижнему регистру
    return fixItem.includes(input.value.toLowerCase());    //Проверяем на совпадения с инпутом
  });

  filterCity.forEach((item) => {                    //цикл
    const li = document.createElement('li');        //создаем элемент li в док
    li.classList.add('dropdown__city');             //добавляем элементу li класс
    li.textContent = item;                          //присваивааем контент
    list.append(li);                  //добавляем элемент в конец эелемента
  });
};

const selectCity = (event, input, list) => { 
  const target = event.target;                        //Создаем переменную в которую записываем значение на которые нажали КМ   
  if (target.tagName.toLowerCase() === 'li') {         //Условие
    input.value = target.textContent;            
    list.textContent = '';                              //Убрать список после выбора города
  } 
}

inputCitiesFrom.addEventListener('input', () => {  //Навешиваем событие на инпут
  showCity(inputCitiesFrom, dropdownCitiesFrom);
});        

dropdownCitiesFrom.addEventListener('click', () => {  //Навешиваем событие на всплывающий список(на нажатие КМ)
  selectCity(event, inputCitiesFrom, dropdownCitiesFrom);
});

inputCitiesTo.addEventListener('input', () => {
  showCity(inputCitiesTo, dropdownCitiesTo);
});

dropdownCitiesTo.addEventListener('click', () => {
  selectCity(event, inputCitiesTo, dropdownCitiesTo);
});
