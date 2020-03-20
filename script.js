const formSearch = document.querySelector('.form-search'),
  inputCitiesFrom = document.querySelector('.input__cities-from'),
  dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
  inputCitiesTo = document.querySelector('.input__cities-to'),
  dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
  inputDateDepart = document.querySelector('.input__date-depart');

//данные

const citiesApi = 'dataBase/cities.json',
  proxy = 'https://cors-anywhere.herokuapp.com/',
  API_KEY = '1149a501e726e1344abdde813e8e8787',
  calendar = 'http://min-prices.aviasales.ru/calendar_preload';

let city = [];

// const citiesApi = 'http://api.travelpayouts.com/data/ru/cities.json',
//       proxy = 'https://cors-anywhere.herokuapp.com/';      

// const city = ['Сватове', 'Купянск', 'Старобельск', 'Северодонецк', 'Лисичанск', 'Рубежное', 'Харьков', 'Луганск', 'Киев', 'Одесса', 'Днепр', 'Житомыр', 'Красный Луч', 'Ростов-на-Дону', 'Москва', 'Львов', 'Варшава', 'Вроцлав', 'Берлин', 'Вронки', 'Познань', 'Донецк', 'Полтава', 'Изюм', 'Борова', 'Станица'];

const getData = (url, callback) => {
  const request = new XMLHttpRequest();   //создаем обьект на основе API

  request.open('GET', url);       //производим настройки, какой будет запрос(GET,POST) и передаем урл адресс

  request.addEventListener('readystatechange', () => { //навешиваем обработчик события чтоб не пропустит когда нам придет ответ
    if (request.readyState !== 4) return;

    if (request.status === 200) {
      callback(request.response);
    } else {
      console.error(request.status);
    }
  });

  request.send(); //запроса не будет пока не выполним сенд
};

const showCity = (input, list) => {
  list.textContent = '';              //Очищаем список перед каждым вводом

  if (input.value !== '') {
    const filterCity = city.filter((item) => {        //Фильтруем массив city
      
      const fixItem = item.name.toLowerCase();             //Переводим к нижнему регистру
      return fixItem.includes(input.value.toLowerCase());    //Проверяем на совпадения с инпутом
      
    });

    filterCity.forEach((item) => {                    //цикл
      const li = document.createElement('li');        //создаем элемент li в док
      li.classList.add('dropdown__city');             //добавляем элементу li класс
      li.textContent = item.name;                          //присваивааем контент
      list.append(li);                  //добавляем элемент в конец эелемента
    });
  }
};

const selectCity = (event, input, list) => {
  const target = event.target;                        //Создаем переменную в которую записываем значение на которые нажали КМ   
  if (target.tagName.toLowerCase() === 'li') {         //Условие
    input.value = target.textContent;
    list.textContent = '';                              //Убрать список после выбора города
  }
}

const renderCheapDay = (cheapTicket) => {
  console.log(cheapTicket);
};

const renderCheapYear = (cheapTickets) => {
  console.log(cheapTickets);
};

const renderCheap = (data, date) => {
  const cheapTicketYear = JSON.parse(data).best_prices;

  const cheapTicketDay = cheapTicketYear.filter((item) => {
    return item.depart_date === date;
  });



  renderCheapDay(cheapTicketDay);
  renderCheapYear(cheapTicketYear);
};

//Обработчики событий

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

formSearch.addEventListener('submit', (event) => {
  event.preventDefault();     //чтоб браузер не перезагружался

  const cityFrom = city.find((item) => inputCitiesFrom.value === item.name);
  const cityTo = city.find((item) => inputCitiesTo.value === item.name);

  const formData = {
    from: cityFrom.code,
    to: cityTo.code,
    when: inputDateDepart.value,
  };

  const requestData = '?depart_date=' + formData.when +
    '&origin=' + formData.from +
    '&destination=' + formData.to +
    '&one_way=true&token=' + API_KEY;

  getData(proxy + calendar + requestData, (response) => {
    renderCheap(response, formData.when);
  });

});

//Вызовы функций

getData(citiesApi, (data) => {
  city = JSON.parse(data).filter(item => item.name);
});

// getData(proxy + citiesApi, (data) => {
//   console.log(data);
// });

/* getData(proxy + calendar + '?depart_date=2020-05-25&origin=SVX&destination=KGD&one_way=true&token=' + API_KEY, (data) => {
  const cheapTicket = JSON.parse(data).best_prices.filter(item => item.depart_date === '2020-05-25');
  console.log(cheapTicket);
}); */