const apiKey = 'd6074a787c55bb4d9af2c8a15c62a1a9';

function loadToday(data, cityName) {
    
    $('#dateMain').text(`${cityName} (${moment(data.daily[0].dt, 'X').format('L')})`);
    $('#iconMain').attr('src', `http://openweathermap.org/img/wn/${data.daily[0].weather[0].icon}@2x.png`);
    for(let i = 0; i < 6; i++) {
        $(`.card${i}`).children('.date').text(`(${moment(data.daily[i].dt, 'X').format('L')})`);
        $(`.card${i}`).children('.temp').text(`Temp: ${((data.daily[i].temp.max + data.daily[i].temp.max)/2)} F`);
        $(`.card${i}`).children('.wind').text(`Wind: ${data.daily[i].wind_speed} MPH`);
        $(`.card${i}`).children('.humidity').text(`Humidity: ${data.daily[i].humidity}%`);
        $(`.card${i}`).children('.icon').attr('src', `http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png`);
    }
    $(`.todayData`).children('.uvIndex').text(`UV Index: ${data.daily[0].uvi}`);
}

function weatherApi(lat, long, cityName) {
    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=imperial&appid=${apiKey}`;
    
    fetch(url)
        .then(function(response) {
            if(response.status !== 404){
                return response.json();
            }else{
                return false;
            }
        }).then(function(data) {
            if(data){
                loadToday(data, cityName);
            }
        });
}

function cordsApi(cityName, local) {
    let url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${apiKey}`;
    fetch(url)
        .then(function(response) {
            if(response.status !== 404){
                return response.json();
            }else{
                return false;
            }
        }).then(function(data) {
            if(local){
                saveToLocal(cityName);
            }
            if(data){
                weatherApi(data[0].lat, data[0].lon, cityName);
            }
        });
}

let localArray = [];
if(localStorage.getItem('previousCities')){
    localArray = JSON.parse(localStorage.getItem('previousCities'));
    localArray.forEach(index => $(`#localStorage`).append($(`<button type="button" class="btn btn-primary localBtn">${index}</button>`)));
}

function saveToLocal(cityName) {
    $(`#localStorage`).empty();
    if(localArray.length < 8){
        localArray.push(cityName);
    }else{
        localArray = localArray.slice(1, 8);
        localArray.push(cityName);
    }
    localArray.forEach(index => $(`#localStorage`).append($(`<button type="button" class="btn btn-primary localBtn">${index}</button>`)));
    localStorage.setItem('previousCities', JSON.stringify(localArray));
}

$('.searchCard').on('click', '.searchBtn',function (){
    $(`#citySearch`).val();
    cordsApi($(`#citySearch`).val(), true);
    $(`#citySearch`).val('');
});

$('#localStorage').on('click', '.localBtn',function (){
    $(this).val();
    cordsApi($(this).text(), false);
});

cordsApi('Austin', false);