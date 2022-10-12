let settings = {
    "url": "https://api.exmo.com/v1.1/ticker",
    "method": "POST",
    "timeout": 0,
    "headers": {
        "Content-Type": "application/x-www-form-urlencoded"
    },
};

let arr = $.ajax(settings).done(function (response) {
    console.log(response);
    //заполняем масив ключами
    let arrKey = [];
    let i = 0;
    for (x in response) {
        arrKey[i] = x;
        i++;
    }
    //массыв с наличием USDT
    let arrUSDT = [];

    for (let k = 0; k < arrKey.length; k++) {
        if (arrKey[k].includes('USDT') && arrKey[k].split('_')[0] !== 'USDT') {
            arrUSDT.push(arrKey[k]);

        }
    }
    //массив з USD
    let arrUSD = [];
    for (let k = 0; k < arrKey.length; k++) {
        if (arrKey[k].split('_')[1] === 'USD' ) {
            arrUSD.push(arrKey[k]);
        }
    }
    // console.log(arrUSD);
    // console.log(arrUSDT);


    calc_buyCoin_sellCoinToMain_sellMainUSDT(response, JSON.parse(JSON.stringify(arrUSDT)), arrKey, 'BTC');
    calc_buyCoin_sellCoinToMain_sellMainUSDT(response, JSON.parse(JSON.stringify(arrUSDT)), arrKey, 'ETH');


    calc_buyCoin_buyMain_sellUSDT(response, JSON.parse(JSON.stringify(arrUSDT)), arrKey, 'XRP');
    calc_buyCoin_buyMain_sellUSDT(response, JSON.parse(JSON.stringify(arrUSDT)), arrKey, 'BCH');


    calc_buyCoin_buyMain_sellUSD(response, JSON.parse(JSON.stringify(arrUSD)), arrKey, 'LTC');



    calc_buyCoin_sellCoinToMain_sellMainTo_USD(response, JSON.parse(JSON.stringify(arrUSD)), arrKey, 'BTC');
    calc_buyCoin_sellCoinToMain_sellMainTo_USD(response, JSON.parse(JSON.stringify(arrUSD)), arrKey, 'ETH');


    calc_buyCoin_sellToMain_buyUSDT(response, JSON.parse(JSON.stringify(arrUSDT)), arrKey, 'UAH');
    calc_buyCoin_sellToMain_buyUSDT(response, JSON.parse(JSON.stringify(arrUSDT)), arrKey, 'EUR');
    calc_buyCoin_sellToMain_buyUSDT(response, JSON.parse(JSON.stringify(arrUSDT)), arrKey, 'GBP');
    calc_buyCoin_sellToMain_buyUSDT(response, JSON.parse(JSON.stringify(arrUSDT)), arrKey, 'PLN');


    //тест split && include
    // let nam = [];
    // for (let k = 0; k < arrUSDT.length; k++) {
    //     nam[k] = arrUSDT[k].split('_')[1];
    // }
    // for (x in response) {
    //     if (x.includes('ADA') && x.includes('BTC')) console.log(response[x]['buy_price'])
    // }

});
function calc_buyCoin_buyMain_sellUSDT(response, arrUSDT, arrKey, mainCoin){
    for (let k = 0; k < arrUSDT.length; k++) {
        let right = arrUSDT[k].split('_')[0];
        right = mainCoin + '_' + right;
        let flag = false;
        for (let ii = 0; ii < arrKey.length; ii++) {
            if (arrKey[ii] === right) {
                flag = true;
                break;
            }
        }
        if (!flag) {
            // console.log("not " + left);
            arrUSDT.splice(k, 1);
            k--;
        }
    }
    // console.log(arrUSDT);
    let arrResult = []
    let coin_USDT = mainCoin + '_USDT';
    for (let k = 0; k < arrUSDT.length; k++) {
        let buyCoinForUSDT = (1 / response[arrUSDT[k]]['sell_price']).toFixed(8);
        let coin = arrUSDT[k].split('_')[0];
        let str = mainCoin + '_' + coin;
        let buyBTCForCoin = (buyCoinForUSDT / response[str]['sell_price']).toFixed(8);
        arrResult[k] = buyBTCForCoin * response[coin_USDT]['buy_price'];
    }
    print(mainCoin, 'USDT', arrResult, arrUSDT);
}
function calc_buyCoin_sellToMain_buyUSDT (response, arrUSDT, arrKey, mainCoin){
    let arr = arrUSDT;
    for (let k = 0; k < arr.length; k++) {
        let left = arr[k].split('_')[0];
        left += '_' + mainCoin;
        let flag = false;
        for (let ii = 0; ii < arrKey.length; ii++) {
            if (arrKey[ii] === left) {
                flag = true;
                break;
            }
        }
        if (!flag) {
            // console.log("not " + left);
            arr.splice(k, 1);
            k--;
        }
    }
    // console.log(arr);
    let arrResult = []
    let USDT_mainCoin = 'USDT_' + mainCoin ;
    for (let k = 0; k < arrUSDT.length; k++) {
        let buyCoinForUSDT = (1 / response[arrUSDT[k]]['sell_price']).toFixed(8);
        let coin = arrUSDT[k].split('_')[0];
        let str = coin + '_' + mainCoin;
        let buyBTCForCoin = (buyCoinForUSDT * response[str]['buy_price']).toFixed(8);
        arrResult[k] = buyBTCForCoin / response[USDT_mainCoin]['sell_price'];
    }
    print(mainCoin, 'USDT', arrResult, arrUSDT);

    // console.log('res with USDT ' + mainCoin);
    // for (let k = 0; k < arrResult.length; k++) {
    //     console.log(arrUSDT[k] + " -> " + arrResult[k]);
    // }

}
function calc_buyCoin_buyMain_sellUSD (response, arrUSD, arrKey, mainCoin){
    for (let k = 0; k < arrUSD.length; k++) {
        let right = arrUSD[k].split('_')[0];
        right = mainCoin + '_' + right;
        let flag = false;
        for (let ii = 0; ii < arrKey.length; ii++) {
            if (arrKey[ii] === right) {
                flag = true;
                break;
            }
        }
        if (!flag) {
            // console.log("not " + left);
            arrUSD.splice(k, 1);
            k--;
        }
    }
    // console.log(arrUSD);
    let arrResult = []
    let coin_USDT = mainCoin + '_USD';
    for (let k = 0; k < arrUSD.length; k++) {
        let buyCoinForUSDT = (1 / response[arrUSD[k]]['sell_price']).toFixed(8);
        let coin = arrUSD[k].split('_')[0];
        let str = mainCoin + '_' + coin;
        let buyBTCForCoin = (buyCoinForUSDT / response[str]['sell_price']).toFixed(8);
        arrResult[k] = buyBTCForCoin * response[coin_USDT]['buy_price'];
    }
    print(mainCoin, 'USD', arrResult, arrUSD);
}
function calc_buyCoin_sellCoinToMain_sellMainTo_USD (response, arrUSD, arrKey, mainCoin){

    for (let k = 0; k < arrUSD.length; k++) {
        let left = arrUSD[k].split('_')[0];
        left += '_' + mainCoin;
        let flag = false;
        for (let ii = 0; ii < arrKey.length; ii++) {
            if (arrKey[ii] === left) {
                flag = true;
                break;
            }
        }
        if (!flag) {
            // console.log("not " + left);
            arrUSD.splice(k, 1);
            k--;
        }
    }
    for (let i = 0; i < arrUSD.length; i++) {
        if (arrUSD[i].split('_')[1] === 'USDT'){
            arrUSD.splice(i,1);
            i--;
        }
    }


    let arrResult = []
    let coin_USDT = mainCoin + '_USD';
    for (let k = 0; k < arrUSD.length; k++) {
        let buyCoinForUSD = (1 / response[arrUSD[k]]['sell_price']).toFixed(8);
        let coin = arrUSD[k].split('_')[0];
        let str = coin + '_' + mainCoin;
        let buyBTCForCoin = (buyCoinForUSD * response[str]['buy_price']).toFixed(8);
        arrResult[k] = buyBTCForCoin * response[coin_USDT]['buy_price'];
    }
    print(mainCoin, 'USD', arrResult, arrUSD);

    // console.log('res with USD ' + mainCoin);
    // for (let k = 0; k < arrResult.length; k++) {
    //     console.log(arrUSD[k] + " -> " + arrResult[k]);
    // }
}
function calc_buyCoin_sellCoinToMain_sellMainUSDT (response , arrUSDT, arrKey, mainCoin){

    // console.log(response);
    // console.log(arrUSDT);

    for (let k = 0; k < arrUSDT.length; k++) {
        let left = arrUSDT[k].split('_')[0];
        left += '_' + mainCoin;
        let flag = false;
        for (let ii = 0; ii < arrKey.length; ii++) {
            if (arrKey[ii] === left) {
                flag = true;
                break;
            }
        }
        if (!flag) {
            // console.log("not " + left);
            arrUSDT.splice(k, 1);
            k--;
        }
    }
    // console.log(arrUSDT);
    let arrResult = []
    let coin_USDT = mainCoin + '_USDT';
    for (let k = 0; k < arrUSDT.length; k++) {
        let buyCoinForUSDT = (1 / response[arrUSDT[k]]['sell_price']).toFixed(8);
        let coin = arrUSDT[k].split('_')[0];
        let str = coin + '_' + mainCoin;
        let buyBTCForCoin = (buyCoinForUSDT * response[str]['buy_price']).toFixed(8);
        arrResult[k] = buyBTCForCoin * response[coin_USDT]['buy_price'];
    }
    print(mainCoin, 'USDT', arrResult, arrUSDT);
    // console.log(arrResult);
    // console.log('res with USDT ' + mainCoin);
    // for (let k = 0; k < arrResult.length; k++) {
    //     console.log(arrUSDT[k] + " -> " + arrResult[k]);
    // }
}
function print (mainCoin, withCoin, arrResult, arr){
    // console.log(arrResult);

    let parent = document.querySelector('#parent');
    let p = document.createElement('p');

    p.innerText = withCoin + ' with ' + mainCoin+'\n';
    // parent.appendChild(p);
    parent.append(p);

    for (let k = 0; k < arrResult.length; k++) {
        if (arrResult[k] >= 1 && arr[k].split('_')[0] !== "PLCU" && arr[k].split('_')[0] !== "SHIB") {
            let p1 = document.createElement('p');
            if (arrResult[k] <= 5) {
                if (arrResult[k] >= 1.003) p1.style.background = 'lightcoral';
                else p1.style.background = 'yellow';
            }
            p1.innerText += (arr[k] + " -> " + arrResult[k] + '\n');
            p1.innerText += (arr[k] + " -> " + arrResult[k] * 0.003 + '\n');
            parent.append(p1);
        }
    }
}
// setTimeout(function() {
//     location.reload();
// }, 30000);