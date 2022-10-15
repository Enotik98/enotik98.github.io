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
// let price = [];

$.ajax(setting1).done(function (response) {

    let arrKey = response['symbols'];
    console.log(arrKey);
    let arrUSDT = [];
    let arrUSD = [];
    let usdt = 0, usd = 0;
    for (let i = 0; i < arrKey.length; i++) {
        if (arrKey[i]['quoteAsset'] === 'USDT' && arrKey[i]['status'] !== "BREAK") {
            arrUSDT[usdt] = arrKey[i];
            usdt++;
        }
        if (arrKey[i]['quoteAsset'] === 'BUSD' && arrKey[i]['status'] !== "BREAK") {
            arrUSD[usd] = arrKey[i];
            usd++;
        }
    }
    let pr;
    $.ajax(setting).done(function (response) {
        pr = response;
        // console.log(pr)
        pr = pr.reduce(function (arr, val) {
            arr[val.symbol] = {"price": val.price};
            return arr
        }, {});

        arrKey = arrKey.reduce(function (arr, val) {
            arr[`${val.baseAsset}_${val.quoteAsset}`] = {...val, ...pr[val.symbol]};

            return arr
        }, {});

        buy_sell_sell_USDT(arrKey, arrUSDT, 'BTC');
        buy_sell_sell_USDT(arrKey, arrUSDT, 'ETH');
        buy_sell_sell_USDT(arrKey, arrUSDT, 'EUR');
        buy_sell_sell_USDT(arrKey, arrUSDT, 'GBP');
    });

});

function buy_sell_sell_USDT(arrKey, arrUSDT, mainCoin) {
    addP("USDT", mainCoin);
    let arrResult = [];
    // debugger
    let pr_Main_USDT
        if (arrKey[mainCoin + '_USDT']){
            pr_Main_USDT = arrKey[mainCoin + '_USDT']['price'];
        }else {
            if (arrKey['USDT_'+mainCoin]){
                pr_Main_USDT = arrKey['USDT_'+mainCoin]['price'];
            }else {
                console.log("not found " + mainCoin);
                return;
            }
        }
    for (let i = 0; i < arrUSDT.length; i++) {
        if (arrUSDT[i]['baseAsset'] === mainCoin) {
            continue
        }
        let prCoin_Main;
        if (!arrKey[arrUSDT[i]['baseAsset'] + '_' + mainCoin]) {
            continue
        }

        if ( arrKey[arrUSDT[i]['baseAsset'] + '_' + mainCoin]['status'] === "BREAK"){
            continue
        }
            prCoin_Main = arrKey[arrUSDT[i]['baseAsset'] + '_' + mainCoin]['price'];

        // if (arrKey[arrUSDT[i]['baseAsset'] + '_' + mainCoin] && arrKey[arrUSDT[i]['baseAsset'] + '_' + mainCoin]['status'] !== "BREAK") {
        //     prCoin_Main = arrKey[arrUSDT[i]['baseAsset'] + '_' + mainCoin]['price'];
        // }else {
        //     if (arrKey[mainCoin + '_' + arrUSDT[i]['baseAsset']] && arrKey[mainCoin + '_' + arrUSDT[i]['baseAsset']]['status'] !== "BREAK"){
        //         prCoin_Main = arrKey[mainCoin + '_' + arrUSDT[i]['baseAsset']]['price'];
        //     }else{
        //         continue
        //     }
        // }

        let prCoin_USDT = arrKey[arrUSDT[i]['baseAsset'] + '_' + arrUSDT[i]['quoteAsset']]['price'];
        let buyCoin = (1 / prCoin_USDT).toFixed(8);
        let buyMain = (buyCoin * prCoin_Main).toFixed(8);
        arrResult[i] = buyMain * pr_Main_USDT;

        if (arrResult[i] >= 1.01) {
            pri(mainCoin, arrResult[i], arrUSDT[i]['symbol'], prCoin_USDT, prCoin_Main, pr_Main_USDT)
        }
    }
    console.log(arrResult);
    // printRes(mainCoin, 'USDT', arrResult, arrUSDT);
}


function addP(withCoin, mainCoin) {
    let parent = document.querySelector('#parent2');
    let p = document.createElement('p');
    p.style.background = 'springgreen';
    p.style.fontSize = '25px';
    p.innerText = withCoin + ' with ' + mainCoin + '\n';
    parent.append(p);

}

function pri(mainCoin, res, coin, buyCoin, buyMain, main) {
    let parent = document.querySelector('#parent2');
    let p = document.createElement('p');
    p.style.background = 'lightcoral';
    p.innerText += (coin + " -> " + res + " -> " + mainCoin + '\n');
    p.innerText += ("Buy " + ": " + buyCoin + " => " + buyMain + " => " + main);

    parent.append(p);

}

function printRes(mainCoin, withCoin, arrResult, arr) {
    // console.log(arrResult);

    let parent = document.querySelector('#parent2');
    let p = document.createElement('p');

    p.innerText = withCoin + ' with ' + mainCoin + '\n';
    parent.append(p);

    for (let k = 0; k < arrResult.length; k++) {
        if (arrResult[k] >= 1.003) {
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
}, 90000);