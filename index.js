const quoteUrl = "http://api.quotable.io/random"
const quoteDisplayElement = document.getElementById('quoteDisplay')
const quoteInputElement = document.getElementById('quoteInput')
const timerElement = document.getElementById('timer') 

let bestScore = 20
let wpmCalc
var arrQuoteLength
var noOfIncorrects = 0
let arrIdx = 0
let myInterval
var noOfEntries = 0

quoteInputElement.addEventListener('input', () => {
    const arrQuote = quoteDisplayElement.querySelectorAll('span')
    const arrValue = quoteInputElement.value.split('')
    arrQuoteLength = arrQuote.length
    
    let correct = true
    noOfEntries += 1

    arrQuote.forEach((charSpan, idx) => {
        const char = arrValue[idx]

        if (char == null){
            charSpan.classList.remove('correct')
            charSpan.classList.remove('incorrect')
            correct = false
        } else if (char === charSpan.innerText){
            charSpan.classList.add('correct')
            charSpan.classList.remove('incorrect')
        } else{
            charSpan.classList.remove('correct')
            charSpan.classList.add('incorrect')
            // noOfIncorrects += 1
            correct = false
        }
    })



    if (correct) {
        timerElement.innerText = "Well Done!"
        clearInterval(myInterval)
        getWPM()
        getBestScore()
        
    }
})

function getQuote(){
    return fetch(quoteUrl)
    .then(response => response.json())
    .then(data => data.content)
}

async function getnewQuote(){
    const quote = await getQuote()
    quoteDisplayElement.innerHTML= ''

    quote.split('').forEach(char => {
        const charSpan = document.createElement('span')
        charSpan.innerText = char
        quoteDisplayElement.appendChild(charSpan)
    })

    quoteInputElement.innerText = null
    startTimer()
}

let startTime
function startTimer(){
    timerElement.innerText = 0
    startTime = new Date()
    myInterval = setInterval(() => {
        timerElement.innerText = getTimerTime()
        if(getTimerTime() === 10){
            timerElement.innerText = 'Times Up!'
            getWPM()
            clearInterval(myInterval)
            getBestScore()
        }
    }, 1000);
}

function getTimerTime(){
    return Math.floor((new Date() - startTime) / 1000)
}


function getWPM(){
    const wpm = document.createElement('h1')
    // console.log(noOfEntries, getTimerTime(), (getTimerTime())/60)
    wpmCalc = Math.round((noOfEntries/5)/((getTimerTime())/60))
    // console.log(wpmCalc)
    wpm.innerText = `Your Score: ${wpmCalc}wpm`
    document.body.appendChild(wpm)
}

function getBestScore(){
    const scoreElement = document.createElement('h2')
    if (wpmCalc > bestScore){
        const para = document.createElement('p')
        para.innerText = 'You have got a new best score!'
        document.body.appendChild(para)
        scoreElement.innerText = ` 🙇🏻‍♂️Your New Best Score: ${wpmCalc}wpm`
    } else {
        scoreElement.innerText = `Your Best Score: ${wpmCalc}wpm`
    }
    document.body.appendChild(scoreElement)
}

getnewQuote()