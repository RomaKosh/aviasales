const formSearch = document.querySelector('.form-search'),
  inputCitiesFrom = document.querySelector('.input__cities-from'),
  dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
  inputCitiesTo = document.querySelector('.input__cities-to'),
  dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
  inputDateDepart = document.querySelector('.input__date-depart'),
  cheapestTicket = document.getElementById('cheapest-ticket'),
  otherCheapTickets = document.getElementById('other-cheap-tickets');

//данные

const citiesApi = 'dataBase/cities.json',
  proxy = 'https://cors-anywhere.herokuapp.com/',
  API_KEY = '1149a501e726e1344abdde813e8e8787',
  calendar = 'http://min-prices.aviasales.ru/calendar_preload',
  MAX_COUNT = 10;

let city = [];

// const citiesApi = 'http://api.travelpayouts.com/data/ru/cities.json',
//       proxy = 'https://cors-anywhere.herokuapp.com/';      

// const city = ['Сватове', 'Купянск', 'Старобельск', 'Северодонецк', 'Лисичанск', 'Рубежное', 'Харьков', 'Луганск', 'Киев', 'Одесса', 'Днепр', 'Житомыр', 'Красный Луч', 'Ростов-на-Дону', 'Москва', 'Львов', 'Варшава', 'Вроцлав', 'Берлин', 'Вронки', 'Познань', 'Донецк', 'Полтава', 'Изюм', 'Борова', 'Станица'];

//функции

const getData = (url, callback, reject = console.error) => {

  const request = new XMLHttpRequest();   //создаем обьект на основе API

  request.open('GET', url);       //производим настройки, какой будет запрос(GET,POST) и передаем урл адресс

  request.addEventListener('readystatechange', () => { //навешиваем обработчик события чтоб не пропустит когда нам придет ответ
    if (request.readyState !== 4) return;

    if (request.status === 200) {
      callback(request.response);
    } else {
      reject(request.status);
    }
  });
    request.send(); //запроса не будет пока не выполним сенд


};

const showCity = (input, list) => {
  list.textContent = '';              //Очищаем список перед каждым вводом

  if (input.value !== '') {
    const filterCity = city.filter((item) => {        //Фильтруем массив city

      const fixItem = item.name.toLowerCase();             //Переводим к нижнему регистру
      return fixItem.startsWith(input.value.toLowerCase());    //Проверяем на совпадения с инпутом

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

const getLinkAviasales = (data) => {
  let link = 'https://www.aviasales.ru/search/';

  link += data.origin;
  
  const date = new Date(data.depart_date);

  const day = date.getDate();

  link += day < 10 ? '0' + day : day;

  const month = date.getMonth() + 1;

  link += month < 10 ? '0' + month : month;

  link += data.destination;

  return link;
};

const createCard = (data) => {
  const ticket = document.createElement('article');
  ticket.classList.add('ticket');

  let deep = '';

  if (data) {
    deep = `
    <h3 class="agent">${data.gate}</h3>
<div class="ticket__wrapper">
	<div class="left-side">
		<a href="${getLinkAviasales(data)}" target="_blank" " class="button button__buy">Купить
			за ${data.value}₽</a>
	</div>
	<div class="right-side">
		<div class="block-left">
			<div class="city__from">Вылет из города
				<span class="city__name">${getNameCity(data.origin)}</span>
			</div>
			<div class="date">${getDate(data.depart_date)}</div>
		</div>

		<div class="block-right">
			<div class="changes">${getChanges(data.number_of_changes)}</div>
			<div class="city__to">Город назначения:
				<span class="city__name">${getNameCity(data.destination)}</span>
			</div>
		</div>
	</div>
</div>
    `;
  } else {
    deep = '<h3>Билетов на текущую дату не нашлось!</h3>'
  }


  ticket.insertAdjacentHTML('afterbegin', deep);

  return ticket;
};

const renderCheapDay = (cheapTicket) => {
  cheapestTicket.style.display = 'block';
  cheapestTicket.innerHTML = '<h2>Самый дешевый билет на выбранную дату</h2>';

  const ticket = createCard(cheapTicket[0]);
  cheapestTicket.append(ticket);
};

const renderCheapYear = (cheapTickets) => {
  otherCheapTickets.style.display = 'block';
  otherCheapTickets.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>';


  /* cheapTickets.sort((a, b) => {
    if (a.value > b.value) {
      return 1;
    }
    if (a.value < b.value) {
      return -1;
    }
    return 0;
  }); */

  cheapTickets.sort((a, b) => a.value - b.value);

  for (let i = 0; i < cheapTickets.length && i < MAX_COUNT; i++) {
    const ticket = createCard(cheapTickets[i]);
    otherCheapTickets.append(ticket);
  }

  console.log(cheapTickets);
};

const getNameCity = (code) => {
  const objCity = city.find(item => item.code === code);
  return objCity.name;
};

const getDate = date => {
  return new Date(date).toLocaleString('ru', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getChanges = num => {
  if (num) {
    return num === 1 ? 'С одной пересадкой' : 'С двумя пересадками';
  } else {
    return 'Без пересадок';
  }
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
    from: cityFrom,
    to: cityTo,
    when: inputDateDepart.value,
  };

  if (formData.from && formData.to) {

    const requestData = '?depart_date=' + formData.when +
      '&origin=' + formData.from.code +
      '&destination=' + formData.to.code +
      '&one_way=true&token=' + API_KEY;

    getData(proxy + calendar + requestData, (response) => {
      renderCheap(response, formData.when);
    }, (error) => {
      alert('В этом направлении нет рейсов!');
      console.error('Ошибка', error);
    });

  } else {
    alert('Введите корректное название города!');
  }
});

//Вызовы функций

getData(citiesApi, (data) => {
  city = JSON.parse(data).filter(item => item.name);

  city.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    if (a.name < b.name) {
      return -1;
    }
    return 0;
  });
});

// getData(proxy + citiesApi, (data) => {
//   console.log(data);
// });

/* getData(proxy + calendar + '?depart_date=2020-05-25&origin=SVX&destination=KGD&one_way=true&token=' + API_KEY, (data) => {
  const cheapTicket = JSON.parse(data).best_prices.filter(item => item.depart_date === '2020-05-25');
  console.log(cheapTicket);
}); */