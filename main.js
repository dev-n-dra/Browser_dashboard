// javascript
const weatherDisplay = document.querySelector('.weather')
const timeDisplay = document.querySelector('.time')
const coinCards = document.querySelector('.coin-cards')
const addCard = document.querySelector('.add-card')
const addCardBtn = document.querySelector('.add-card-btn')
const coinInput = document.querySelector('.coin-input')



// getting the backgroundImage from the Unsplash api
fetch('https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=Nature')
    .then(response => response.json())
    .then(data => {
        document.querySelector('body').style.backgroundImage = `url(${data.urls.regular})`
        document.querySelector('.author').textContent = `By : ${data.user.name}`
    })
    .catch(err => {
        // Use a default background image/author
        document.body.style.backgroundImage = `url("https://images.unsplash.com/photo-1597600159211-d6c104f408d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNDI0NzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjcwNzQzODk&ixlib=rb-1.2.1&q=80&w=1080")`
        document.querySelector(".author").textContent = `By: Michael Dziedzic`
    })

// getting the location using geolocation and then using the lat and long form that data to obtain the temperature of the current city using openWeatherMap API
navigator.geolocation.getCurrentPosition(
    function(position) {
        // console.log(position)
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${config.hot_key}`)
            .then(res => {
                if (!res.ok) {
                    throw Error("Weather data not available")
                }
                return res.json()
            })
            .then(data => {
                // console.log(data)
                weatherDisplay.innerHTML = `
                     <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}" class="weather-icon" />
                    <div class="weather-info">
                    <h3 class="weather-description">${data.weather[0].description}</h3>
                    <h3 class="city">${data.name}</h3>
                    </div>
                    <div class="temperature">${Math.round(data.main.temp)}°c</div>
                `

            })
    },
    function() {}, { enableHighAccuracy: true });

// displaying the current time using Date and methods
function currentTime() {
    let data = new Date()
    let formatedTime = data.toLocaleTimeString("en-us", { timeStyle: "short" })
    timeDisplay.textContent = formatedTime
}
setInterval(currentTime, 1000)

// adding the crypto card and accessing the crypto data using coingecko API
let coinArray = ['dogecoin', 'bitcoin', 'ethereum']
if (coinArray.length > 2) {
    addCard.style.display = "none"
}

function displayCards() {
    for (let element of coinArray) {
        fetch(`https://api.coingecko.com/api/v3/coins/${element}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`)
            .then(res => {
                if (!res.ok) {
                    throw Error("Coin data not available")
                }
                return res.json()
            })
            .then(data => {
                coinCards.innerHTML += `
                <div class="card","${element}">
                    <img src=${data.image.large} alt="" />
                    <div class="card-info">
                        <h3 class="coin-name">${data.name}</h3>
                        <p class="coin-value">${data.market_data.current_price.usd} usd</p>
                        <div class="change">
                            <div class="percentage-change">${data.market_data.price_change_percentage_24h_in_currency.usd}%</div>
                            <p>% change in 24 hours</p>
                        </div>
                    </div>
                    <div class="delete-card-btn">-</div>
                </div>
            `
                let deleteCardBtn = document.querySelectorAll('.delete-card-btn')
                deleteCardBtn.forEach(element => {
                    element.addEventListener('click', () => {
                        value = element.parentElement.children[1].children[0].textContent
                        value = value.toLowerCase()
                        coinArray = coinArray.filter(item => item !== value)
                        console.log(coinArray)
                        element.parentElement.remove()
                        addCard.style.display = "flex"
                    })
                })
            })
            .catch(err => {
                console.log(err)
                addCard.style.display = "flex"
                coinArray.pop()
                console.log(coinArray)
            })

    }
}

displayCards()
addCardBtn.addEventListener('click', () => {
    if (coinInput.value) {
        coinArray.push(coinInput.value.toLowerCase())
        coinInput.value = ''
        coinCards.innerHTML = ''
        displayCards()
        if (coinArray.length > 2) {
            addCard.style.display = "none"
        } else {
            addCard.style.display = "flex"
        }
    }
})