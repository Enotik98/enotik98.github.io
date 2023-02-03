$('.header__burger').click(function (event){
    $('.menu__open').css('top', 0);
})
$('.closeModal').click(function (event){
    $('.menu__open').css('top', "-100%");
})


//start
$('#Preparing, #Decorative').hide()
$('.Painting, .Preparing, .Decorative').click(function (e) {
    e.preventDefault();
    $('.form-param').removeClass('active');
    $(this).addClass('active');
    const target = $(this).data('target');
    $('#Painting, #Preparing, #Decorative').hide();
    $(`#${target}`).show();
    $('.result-window').addClass('d-none');
    $('#related').prop('checked', false);
    $('#related_list').empty();
})
$('#p_name, #preparing_name, #decorative_type').on('change', function (e) {
    // e.stopPropagation();
    // setTimeout(CreatedRelatedList, 100)
    CreatedRelatedList();
});
let eventList = $._data($('#painting_type')[0], 'events')
console.log(eventList)
//input check square
$('#square').on('input', checkInputSquare);
$('.paramSquare').on('input', checkInputParamSquare)

function checkInputSquare() {
    if (this.value.length) {
        $(this).removeClass('is-invalid').addClass('is-valid');
        $('.paramSquare').addClass('d-none').removeAttr('required');
        $('.paramLabel').addClass('d-none');
    } else {
        $(this).addClass('is-invalid');
        $('.paramSquare').removeClass('d-none').attr('required', true);
        $('.paramLabel').removeClass('d-none');
    }
}

function checkInputParamSquare() {
    if (this.value.length) {
        // $(this).removeClass('is-invalid').addClass('is-valid');
        $('#square').addClass('d-none').removeAttr('required');
        $('.squareLabel').addClass('d-none');
    } else {
        // $(this).addClass('is-invalid');
    }
    if (!$('#width').val() && !$('#height').val() && !$('#length').val()) {
        $('#square').removeClass('d-none').attr('required', true);
        $('.squareLabel').removeClass('d-none');
    }
}

//input doors and windows
$('#nDoor').on('change', function () {
    $('#doorInput').empty();
    for (let k = 1; k <= this.value; k++) {
        $('#doorInput').append(`<div class="row has-validation"><div class="col-6">Ширина, м <input type='number' name='door_width${k}' class='form-control is-invalid' required></div>
<div class="col-6">Висота, м <input type='number' name='door_height${k}' class='form-control is-invalid' required></div></div>`);
    }
})
$('#nWindow').on('change', function () {
    $('#windowInput').empty();
    for (let k = 1; k <= this.value; k++) {
        $('#windowInput').append(`<div class="row"><div class="col-6">Ширина, м <input type='number' name='window_width${k}' class='form-control is-invalid' required></div>
<div class="col-6">Висота, м <input type='number' name='window_height${k}' class='form-control is-invalid' required></div></div>`);
    }
})
$('#form_square input').on('input', function () {
    if (this.value.length) {
        $(this).addClass('is-valid').removeClass('is-invalid')
    } else {
        $(this).addClass('is-invalid').removeClass('is-valid')
    }
})
$(document).on('input', '#form_square input', function () {
    if (this.value.length) {
        $(this).addClass('is-valid').removeClass('is-invalid')
    } else {
        $(this).addClass('is-invalid').removeClass('is-valid')

    }
})


$('#related').on('change', function () {

    // let v = $("select[name='name']:visible").val()
    // console.log(this.checked + ' ' + v);

    //delete this function and add code her
    CreatedRelatedList()

})
$(document).on('change', '#related_list input', function () {
    let val = this.value;
    let type = null;
    if (this.checked) {
        if (val.includes('Короїд')) {
            val = val.replace(/ 'Короїд'/, "");
            type = 'Короїд';
        }
        if (this.value.includes('Камінцева')) {
            val = val.replace(/ 'Камінцева'/, "");
            type = 'Камінцева';
        }
        console.log(val)
        let sel = $(`.${this.id}`).removeClass('d-none');
        // const relativeObject = findKeyInObject(window.json, val);
        let relativeObject = findProductInJson(val);
        if (type) {
            relativeObject = relativeObject[type];
        }
        for (let key in relativeObject) {
            if (key !== "Layers" && key !== "pre-packing" && key !== "Related_products") {
                sel.append($('<option>').attr('value', key).text(optionVal(key)))
            }
        }
    }
})

//type without Decorative
function optionVal(type) {
    let text = null;
    switch (type) {
        case "Structured":
            text = 'Структурні поверхні';
            break;
        case "Repainting":
            text = "Перефарбування поверхні";
            break;
        case "Plasterer":
            text = "Готові зашпакльовані поверхні";
            break;
        case "Fatness 0.5":
            text = "0,5 mm";
            break;
        case "Fatness 1.5":
            text = "1,5 mm";
            break;
        case "Fatness 3":
            text = "3 mm";
            break;
        case "Standard":
            text = "Стандарнті основи";
            break;
        case "Strongly":
            text = "Сильно вбираючі основи";
            break;
        default:
            text = type;
            break;
    }
    return text
}

let relatedList = null;

function CreatedRelatedList() {
    if ($('#related').is(':checked')) {
        let nameProduct = $("select[name='name']:visible").val();
        let typeProduct = $("select[name='type']:visible").val();
        let btn = $("button.active").data('target');
        if (!nameProduct) {
            alert("Оберіть продукт");
            $('#related').prop('checked', false);
            return;
        }
        console.log(nameProduct + " " + typeProduct + " " + btn);
        if (btn !== 'Decorative') {
            relatedList = window.json[btn][typeProduct][nameProduct]['Related_products'];
        } else {
            relatedList = window.json[btn][nameProduct][typeProduct]['Related_products'];
        }
        if (!relatedList) {
            alert('Щось пішло не так');
            $('#related').prop('checked', false);
            return;
        }
        $('#related_list').empty();
        for (let i = 0; i < relatedList.length; i++) {
            $('#related_list').append(`<div class="row"><div class="col-6"><label for="related${i}"><input type="checkbox" name="related${i}" id="related${i}" class="form-ckeck-input" value="${relatedList[i]}"> ${relatedList[i]}</label></div>
<div class="col-6"><select name="${relatedList[i]}" id="${relatedList[i]}" class="form-select related${i} d-none"></select></select></div></div>`)
        }
    } else {
        $('#related_list').empty();
        $('.related_result').addClass('d-none');
    }
}

//function by Melya
// const findKeyInObject = (obj, fieldKey) => {
//     let result = null;
//
//     Object.keys(obj).forEach(key => {
//         if (key === fieldKey) {
//             result = obj[key];
//         } else if (typeof obj[key] === 'object') {
//             result = findKeyInObject(obj[key], fieldKey);
//         }
//     });
//
//     return result;
// }

function findProductInJson(name) {
    const fle = Object.assign(...Object.values(window.json))
    let sle = Object.assign(...Object.values(fle))
    sle = Object.assign({}, sle, fle);
    for (let key in sle) {
        if (key.includes(name)) {
            return sle[name];
        }
    }
}

function searchRelated(relatedArr) {
    const fl = Object.assign(...Object.values(window.json))
    const sl = Object.assign(...Object.values(fl))
    let typeDecor = null;
    for (let i = 0; i < relatedArr.length; i++) {
        if (relatedArr[i].includes("'Короїд'")) {
            relatedArr[i] = relatedArr[i].replace(/ 'Короїд'/, '')
            typeDecor = "Короїд"
            console.log(relatedArr[i])
            break;
        }
        if (relatedArr[i].includes("'Камінцева'")) {
            relatedArr[i] = relatedArr[i].replace(/ 'Камінцева'/, '')
            typeDecor = "Камінцева"
            break;
            // console.log(relatedArr[i])
        }
    }
    let relatedListInJson = Object.keys(sl)
        .filter((key) => {
            return relatedArr.includes(key)
        })
        .reduce((obj, key) => {
            obj[key] = sl[key]
            return obj;
        }, {})
    if (Object.keys(relatedListInJson).length !== relatedArr.length) {
        relatedListInJson = Object.assign({}, relatedListInJson, Object.keys(fl)
            .filter((key) => {
                return relatedArr.includes(key)
            })
            .reduce((obj, key) => {
                obj[key] = fl[key][typeDecor]
                return obj;
            }, {}))
    }

    // console.log(relatedListInJson);
    return relatedListInJson;
}

//submit and calculate
$('.sub').click(function () {
//valid form
    let valid;
    $('#forms form:visible').each(function (_) {
        return valid = this.reportValidity();
    });

    if (!valid) {
        return
    }

    //return object with data
    const forms = $('#forms form:visible')
    const data = Object.assign({}, ...$(forms).map((_, form) => {
        const formData = new FormData(form);
        return Object.fromEntries(formData.entries());
    }))
    console.log(data);
    $('#note').addClass('d-none');

    //calculate square
    let square = 0;
    if (data['square']) {
        square = data['square'];
    } else {
        square += (data['width'] * data['height']) * 2;
        square += (data['length'] * data['height']) * 2;
    }
    if (data['quantityDoor']) {
        for (let i = 1; i <= data['quantityDoor']; i++) {
            square -= data[`door_width${i}`] * data[`door_height${i}`];
        }
    }
    if (data['quantityWindow']) {
        for (let i = 1; i <= data['quantityWindow']; i++) {
            square -= data[`window_width${i}`] * data[`window_height${i}`];
        }
    }

    //return products with json
    let product = window.json;
    let liter = 0;
    let measure = 'л';
    if ($('#Painting').is(':visible')) {
        product = product['Painting'][data['type']][data['name']];
        if (data['type'] === 'Структурні фарби') {
            liter = (square * product['Layers']) * product[data['surface']];
            measure = 'кг';
        } else {
            liter = (square * product['Layers']) / product[data['surface']];
        }
        $('#current').text(data['name']);
        $('#layers').text(product['Layers']);
    }
    if ($('#Preparing').is(':visible')) {
        product = product['Preparing'][data['type']][data['name']];
        // console.log(product)
        if ('Undercoat' !== data['type']) measure = 'кг';
        if ($('.layersSelect').is(':visible')) {
            liter = (square * product['Layers']) * product[data['preparing_layers']]
        }
        if ($('.surfaceSelect').is(':visible')) {
            liter = (square * product['Layers']) * product[data['preparing_surface']]
            $('#note').removeClass('d-none');
        }
        $('#current').text(data['name']);
        $('#layers').text(product['Layers']);

    }
    if ($('#Decorative').is(':visible')) {
        product = product['Decorative'][data['name']][data['type']];
        liter = square * product[data['fraction']];
        measure = 'кг';
        $('#current').text(data['name']);
        $('#layers').text(1);
    }

    //packing
    let quantity = 0;
    let packing = '';
    let temp = liter;
    let pre_packing = product['pre-packing'];
    for (let i = 0; i < pre_packing.length; i++) {
        if (pre_packing.length !== 1) {
            if (temp <= pre_packing[i]) {
                quantity = 1;
                packing += quantity + ' x ' + pre_packing[i] + measure;
                break;
            }
            if (i === pre_packing.length - 1) {
                quantity = Math.trunc(temp / pre_packing[i]);
                temp = temp - (quantity * pre_packing[i]);
                packing += quantity + ' x ' + pre_packing[i] + measure;
                if (temp !== 0) {
                    i = -1;
                    packing += ' та ';
                }
            }
        } else {
            quantity = Math.trunc(temp / pre_packing[i]);
            temp = (temp / pre_packing[i]) - quantity;
            if (temp !== 0) {
                quantity++;
            }
            packing += quantity + ' x ' + pre_packing[i] + measure;
            break;
        }

    }
    // console.log(product['pre-packing'])
    $('.result-window').removeClass('d-none')
    $('#result').text(liter.toFixed(1) + measure + ' або ' + packing);
    $('#resultSquare').text(square);


    //related
    if ($('#related').is(':checked')) {
        let relatedArr = $("[id^=related]:not(#related):checked").map((_, el) => {
            return $(el).val()
        }).toArray();
        console.log("arr" + relatedArr)
        console.log("list" + relatedList)
        let relatedObject = searchRelated([...relatedArr]);
        let related_result = '';
        console.log(relatedObject)
        for (let key in relatedObject) {
            let relatedLiter = 0;
            let type = data[key];
            if (key.includes('Décor')) {
                for (let i = 0; i < relatedArr.length; i++) {
                    if (relatedArr[i].includes("'Короїд'") || relatedArr[i].includes("'Камінцева'")) {
                        type = data[relatedArr[i]];
                        break;
                    }
                }
            } else {
                type = data[key];
            }
            if (type.includes('Structura') || type.includes('Fatness') || key.includes('Décor') || type.includes("Standard") || type.includes("Strongly")) {
                relatedLiter = (square * relatedObject[key]['Layers']) * relatedObject[key][type];

            } else {
                relatedLiter = (square * relatedObject[key]['Layers']) / relatedObject[key][type];
            }
            let related_measure = "л";
            if (type.includes('Structura') || type.includes('Fatness') || key.includes('Décor') || key.includes('Guartz')) {
                related_measure = "кг";
            }

            related_result = $('<p></p>').text(key + ": " + relatedLiter.toFixed(1) + related_measure).addClass('ms-3');
            console.log(relatedLiter);
            $('#related_result').append(related_result);
        }

        $('.related_result').removeClass('d-none');

    }
})


//calculate packing



