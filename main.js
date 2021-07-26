// javascript
const weatherDisplay = document.querySelector('.weather')
const time = document.querySelector('.time')
const coinCards = document.querySelector('.coin-cards')
const addCardContainer = document.querySelector('.add-card-container')
const addCard = document.querySelector('.add-card')
const linkCards = document.querySelector('.link-cards')
const addLinkBtn = document.querySelector('.add-link-btn')
const addCardBtn = document.querySelector('.add-card-btn')
const coinInput = document.querySelector('.coin-input')
const addLink = document.querySelector('.add-link')
const addBtn = document.querySelector('.add-btn')
const linkTitleInput = document.querySelector('#link-title')
const linkUrlInput = document.querySelector('#link-url')
const cancel = document.querySelector('.cancel')
const settingBtn = document.querySelector('.setting')
const settingTab = document.querySelector('.setting-tab')
const saveChange = document.querySelector('.save-change')
const cancelChange = document.querySelector('.cancel-change')
const filter = document.querySelector('#filter')

// getting the backgroundImage from the Unsplash api-----------------------------------------------------------------------------------------------------------
let bgFilter = JSON.parse(localStorage.getItem("bgFilter"))

// if the bgFilter exist then we proceed further but in case the filter does not exist then create an filter
if (!bgFilter) {
    localStorage.setItem("bgFilter", JSON.stringify('Architecture'))
}
bgFilter = JSON.parse(localStorage.getItem("bgFilter"))

function background(filter) {
    fetch(`https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=${filter}`)
        .then(response => response.json())
        .then(data => {
            document.querySelector('body').style.backgroundImage = `url(${data.urls.regular})`
            document.querySelector('.author').textContent = `Background By : ${data.user.name}`
        })
        .catch(err => {
            // Use a default background image/author
            document.body.style.backgroundImage = `url("https://images.unsplash.com/photo-1597600159211-d6c104f408d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNDI0NzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjcwNzQzODk&ixlib=rb-1.2.1&q=80&w=1080")`
            document.querySelector(".author").textContent = `Background By: Michael Dziedzic`
        })
}
background(bgFilter)

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

// displaying the current time using Date and methods---------------------------------------------------------------------------------------------------------
function currentTime() {
    let data = new Date()
    let formatedTime = data.toLocaleTimeString("en-us", { timeStyle: "short" })
    time.textContent = formatedTime
}
setInterval(currentTime, 1000)


// adding the crypto card and accessing the crypto data using coingecko API ----------------------------------------------------------------------------------


// 1st check for the array of coin in local storage
let coinArray = JSON.parse(localStorage.getItem("coinArray"))

// if the coin array exist then we proceed further but in case the array does not exist then create an empty array
if (!coinArray) {
    let emptyArray = ['bitcoin', 'ethereum']
    localStorage.setItem("coinArray", JSON.stringify(emptyArray))
}
coinArray = JSON.parse(localStorage.getItem("coinArray"))


// a function to display the content of the array
function displayCards() {
    // coinArray = JSON.parse(localStorage.getItem("coinArray"))
    for (let element of coinArray) {
        fetch(`https://api.coingecko.com/api/v3/coins/${element.toLowerCase()}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`)
            .then(res => {
                if (!res.ok) {
                    throw Error("Coin data not available")
                }
                return res.json()
            })
            .then(data => {
                coinCards.innerHTML += `
                    <div class="card">
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
                    element.addEventListener('click', function deleteCard() {
                        value = element.parentElement.children[1].children[0].textContent
                        value = value.toLowerCase()
                        coinArray = coinArray.filter(item => item !== value)
                        localStorage.clear()
                        localStorage.setItem("coinArray", JSON.stringify(coinArray))
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
                localStorage.clear()
                localStorage.setItem("coinArray", JSON.stringify(coinArray))
                console.log(coinArray)
            })

        if (coinArray.length > 2) {
            addCard.style.display = "none"
        } else {
            addCard.style.display = "flex"
        }
    }

}


// now it is time to create a function to add coins in the array
function addCoin() {
    if (coinInput.value) {
        coinArray.push(coinInput.value.toLowerCase())
        localStorage.setItem("coinArray", JSON.stringify(coinArray))
        coinInput.value = ''
        coinCards.innerHTML = ''
        displayCards()
    }
}

displayCards()
addCardBtn.addEventListener('click', addCoin)
document.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        addCoin()
    }
})

// moving forward to the links section where we are going to save some links as bookmark and display them on screen in cute little boxes-----------------------

// 1st check for the array of links in local storage
let linkArray = JSON.parse(localStorage.getItem("linkArray"))

// if the link array exist then we proceed further but in case the array does not exist then create an empty array
if (!linkArray) {
    let emptyArray = [{ title: "facebook", url: 'facebook.com' }, { title: "linked in", url: 'linkedin.com' }, { title: 'instagram', url: 'instagram.com' }]
    localStorage.setItem("linkArray", JSON.stringify(emptyArray))
}
linkArray = JSON.parse(localStorage.getItem("linkArray"))

// a function to display the content of the array
function displayLinks() {
    for (let element of linkArray) {
        linkCards.innerHTML += `
            <div class="link-card">
                <a href="https://${element.url}"  target ="blank">
                    <div class="link-box">
                        <img src = "http://www.google.com/s2/favicons?domain=${element.url}"  alt = "">    
                    </div>
                </a>
                <div class="link-info">${element.title}</div>
                <div class="delete-link-btn">-</div>
            </div>
        `
    }
    if (linkArray.length > 5) {
        addCardContainer.style.display = "none"
    } else {
        addCardContainer.style.display = "block"
    }
}

displayLinks()

// now a function which will add the link in the linkArray and call the display function to show them
function addLinktoArray() {
    if (linkArray.length < 6) {
        if (linkTitleInput.value && linkUrlInput.value) {
            let object = {
                title: linkTitleInput.value.toLowerCase(),
                url: linkUrlInput.value.toLowerCase()
            }
            linkArray.push(object)
            addLink.style.display = 'none'
            linkTitleInput.value = ''
            linkUrlInput.value = ''
            console.log(linkArray)
            localStorage.setItem("linkArray", JSON.stringify(linkArray))
            linkCards.innerHTML = ''
            displayLinks()
            deleteLink()
        }
    }

}
addLinkBtn.addEventListener('click', () => {
    addLink.style.display = 'flex'
})
cancel.addEventListener('click', () => {
    addLink.style.display = 'none'
})
addBtn.addEventListener('click', addLinktoArray)
document.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        addLinktoArray()
    }
})

// great now we will make the function to delete the links on the dispaly
function deleteLink() {
    let deleteLinkBtn = document.querySelectorAll('.delete-link-btn')
    deleteLinkBtn.forEach(element => {
        element.addEventListener('click', () => {
            value = element.parentElement.children[1].textContent.toLowerCase()
            linkArray = linkArray.filter(item => item.title !== value)
            localStorage.setItem("linkArray", JSON.stringify(linkArray))
            element.parentElement.remove()
            addCardContainer.style.display = "block"
        })
    })
}
deleteLink()

// ok the links section is completed and now moving forwards to the setting or we can say coustomization tab 

settingBtn.addEventListener('click', () => {
    settingTab.style.display = "flex"
})
cancelChange.addEventListener('click', () => {
    settingTab.style.display = "none"
})

function saveSetting() {
    if (filter.value) {
        localStorage.setItem("bgFilter", JSON.stringify(filter.value))
        bgFilter = JSON.parse(localStorage.getItem("bgFilter"))
        filter.value = ''
        background(bgFilter)
    }
    settingTab.style.display = "none"
}
saveChange.addEventListener('click', saveSetting)
document.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        saveSetting()
    }
})