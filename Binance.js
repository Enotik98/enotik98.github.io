let setting = {
    // "url": "https://api3.binance.com/api/v3/ticker/bookTicker",
    // "url": "https://api3.binance.com/api/v3/ticker/price?symbol=ETHBTC",
    "url": "https://api3.binance.com/api/v3/ticker/price",
    // "url": "https://api.binance.com/api/v3/exchangeInfo",
    "method": "GET",
    "timeout": 0,
    "headers": {
        "Content-Type": "application/x-www-form-urlencoded",
    },
};
let setting1 = {
    // "url": "https://api3.binance.com/api/v3/ticker/bookTicker",
    // "url": "https://api3.binance.com/api/v3/ticker/price",
    "url": "https://api.binance.com/api/v3/exchangeInfo",
    "method": "GET",
    "timeout": 0,
    "headers": {
        "Content-Type": "application/x-www-form-urlencoded",
    },
};
let price = [];

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//
// function getPrice(coin) {
//
//     $.ajax({
//         "url": "https://api3.binance.com/api/v3/ticker/price
//         "method": "GET",
//         "timeout": 0,
//         "headers": {
//             "Content-Type": "application/x-www-form-urlencoded",
//         }
//     }).done(function (response) {
//         console.log(response)
//         price = response['price']
//         return price
//     })
//
//
// }

// let a = $.ajax(setting).done(function (response) {
//     // console.log(response);
//
//     // let def = $.Deferred()
//     price = response;
//     return response
//     // let a = Object.assign({},response);
//     // console.log(a)
// });
let b, k = [];
// getPrice("ADABTC");
$.ajax(setting1).done(function (response) {

    let arrKey = response['symbols'];

    console.log(response)

    let arrUSDT = [];
    let arrUSD = [];
    let usdt = 0, usd = 0;
    for (let i = 0; i < arrKey.length; i++) {
        if (arrKey[i]['quoteAsset'] === 'USDT') {
            arrUSDT[usdt] = arrKey[i];
            usdt++;
        }
        if (arrKey[i]['quoteAsset'] === 'USD') {
            arrUSDT[usd] = arrKey[i];
            usd++;
        }
    }

    // arrUSDT.splice(1, 1);

    $.ajax(setting).done(function (response) {

        price = response;

        let pr = [];
        pr = response;

        // console.log(pr)

        // setTimeout(function () {
        cal_buy_sell_sell((JSON.parse(JSON.stringify(arrUSDT))), arrKey, 'BTC', pr);
        // }, 1000);
    });

});

function getPrice(coin, pr) {
    // console.log(pr)
    for (let i = 0; i < price.length; i++) {
        if (coin === price[i]['symbol']) {
            return price[i]['price']
        }
    }
    return 0
    // debugger
    // let i = price.find(el => el['symbol'] === coin)
    // console.log(i)
    // return price[i]['price']

}

function cal_buy_sell_sell(arrUSDT, arrKey, mainCoin, arrPrice) {

    let parent = document.querySelector('#parent2');
    let p = document.createElement('p');

    p.innerText =  'USDT with ' + mainCoin+'\n';
    parent.append(p);
    let prMainCoin = getPrice(mainCoin + 'USDT', (JSON.parse(JSON.stringify(arrPrice))));
    let arrResult = [];
    for (let i = 0; i < arrUSDT.length; i++) {
        if (arrUSDT[i]['baseAsset'] === mainCoin) {
            continue;
        }
        // let usdt = 0;
        let find = false;
        for (let usdt = 0; usdt < arrKey.length; usdt++) {
            if (arrUSDT[i]['baseAsset'] !== arrKey[usdt]['baseAsset'] && arrKey[usdt]['quotesAsset'] !== mainCoin) {
                find = false;
            } else {
                find = true;
                break;
            }
        }
        if (!find) continue;
        let buy = getPrice(arrUSDT[i]['symbol'], (JSON.parse(JSON.stringify(arrPrice))));
        // if (arrUSDT[i]['symbol'] === 'MITHUSDT') {
        //     console.log(arrUSDT[i])
        //     console.log( " : " + buy);
        // }
        let prWithMainCoin = getPrice(arrUSDT[i]['baseAsset'] + mainCoin, (JSON.parse(JSON.stringify(arrPrice))));


        let buyCoin = (1 / buy).toFixed(8);

        let transitionToMoinCoin = (buyCoin * prWithMainCoin).toFixed(8);

        arrResult[i] = transitionToMoinCoin * prMainCoin;

        if (arrResult[i] >= 1.003){
            // console.log(arrUSDT[i]['symbol']+' buy coin ' + buy);
            pri(mainCoin, arrResult[i], arrUSDT[i]['symbol'], buy, prWithMainCoin, prMainCoin );

        }
        // console.log('Res')
        // console.log(arrUSDT[i]['symbol'] + " = " + arrResult[i]);
    }
    // console.log(arrResult));
    // printRes(mainCoin, 'USDT', arrResult, arrUSDT);

}
function pri (mainCoin, res, coin, buyCoin, buyMain, main){
    let parent = document.querySelector('#parent2');
    let p = document.createElement('p');
    p.style.background = 'lightcoral';
    p.innerText += (coin + " -> " + res + '\n');
    p.innerText += ("Buy " + ": " + buyCoin + " => " + buyMain + " => " + main);

    parent.append(p);

}

function printRes (mainCoin, withCoin, arrResult, arr){
    // console.log(arrResult);

    let parent = document.querySelector('#parent2');
    let p = document.createElement('p');

    p.innerText = withCoin + ' with ' + mainCoin+'\n';
    parent.append(p);

    for (let k = 0; k < arrResult.length; k++) {
        if (arrResult[k] >= 1.003 ) {
            let p1 = document.createElement('p');
            if (arrResult[k] <= 5) {
                if (arrResult[k] >= 1.003) p1.style.background = 'lightcoral';
                else p1.style.background = 'yellow';
            }
            p1.innerText += (arr[k]['symbol'] + " -> " + arrResult[k] + '\n');
            // p1.innerText += (arr[k]['symbol'] + " -> " + arrResult[k] * 0.003 + '\n');
            parent.append(p1);
        }
    }
}
setTimeout(function() {
    location.reload();
}, 30000);