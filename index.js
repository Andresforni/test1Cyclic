const express = require('express');
const app = express();
//require('dotenv').config({path: __dirname + '/.env'});
let text = "HELLO TRADER";
let priceActual = 0;


const request = require('request');


app.all('/', (req, res) => {
    console.log("Just got a request!");
    res.send(text);
});
app.listen(process.env.PORT || 3000);

const TelegramBot = require('./telegram-bot.js');

const token = '5862078723:AAG7HtWPV8WZz-YHfICqebF3pMhOsfA4Cik'; //process.env['TOKEN_TELEGRAM_API']; 


function exampleCallback(message) {
    if (message.action == '/start') {
        return 'Hello trader!';
    }
    if (message.action == '/hello') {
        if (message.text.split(' ').length == 2) {
            return 'Hello, ' + message.text.split(' ')[1];
        } else {
            return 'Hello, Noname';
        }
    }

    if (message.action == '/btc') {

        return 'BTC: ' + priceActual;
    }


}

const exampleBot = new TelegramBot(token, exampleCallback);

exampleBot.start();


// let market = 'BTCUSDT';
// let tick_interval = '5m';
// let limit = 20;
// let url = 'https://api.binance.com/api/v3/klines?symbol=' + market + '&interval=' + tick_interval + '&limit=' + limit;
// request(url, { json: true }, (err, res, data) => {
//     if (err) { return console.log(err); }
//     let sma = 0;
//     data.forEach(element => {
//         let value = parseFloat(element[4]);
//         sma += value;
//     });
//     sma = sma / data.length;
//     console.log('SMA: ' + sma);
//     console.log(getEMA(data, 9));
//     //console.log(body.explanation);
// });








//cada 5seg calcula los datos
const interval = setInterval(function () {
    let market = 'BTCUSDT';
    let tick_interval = '5m';
    let limit = 20;
    let url = 'https://api.binance.com/api/v3/klines?symbol=' + market + '&interval=' + tick_interval + '&limit=' + limit;
    request(url, { json: true }, (err, res, data) => {
        if (err) { return console.log(err); }
        
        priceActual= parseFloat(data[data.length-1][4]);
        console.log(priceActual);
        
        //console.log(getEMA(data, 9));
        //console.log(body.explanation);
    });


}, 5000);

//clearInterval(interval);




//calcule EMA
function getEMA(binanceData, interval) {
    let weight = 2 / (interval + 1);
    let ema = parseFloat(binanceData[0][4]);
    for (let index = 1; index < binanceData.length - 1; index++) {
        ema = weight * parseFloat(binanceData[index][4]) + (1 - weight) * ema;
    }
    return ema;
}
