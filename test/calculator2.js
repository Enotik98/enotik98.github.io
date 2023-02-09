// $('.header__burger').click(function (event) {
//     $('.menu__open').css('top', 0);
// })
// $('.closeModal').click(function (event) {
//     $('.menu__open').css('top', "-100%");
$('.header_burger').click(function () {
    $('.header_burger, .header_menu').toggleClass('active');
})
$('.pointer').click(function () {
    const target = $(this).data('target')
    $(`#${target}`).toggleClass('active')
})
$('.logo_span img').data('link', "https://poli-plast.ua/ua").click(function () {
    window.location = $(this).data('link')
});

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
    CreatedRelatedList();
});

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
        $('#square').addClass('d-none').removeAttr('required');
        $('.squareLabel').addClass('d-none');
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
        $('#doorInput').append(`<div class="row has-validation"><div class="col-6">Ширина, м <input type='number' name='door_width${k}' class='form-control is-invalid' step="any" required></div>
<div class="col-6">Висота, м <input type='number' name='door_height${k}' class='form-control is-invalid' step="any" required></div></div>`);
    }
})
$('#nWindow').on('change', function () {
    $('#windowInput').empty();
    for (let k = 1; k <= this.value; k++) {
        $('#windowInput').append(`<div class="row"><div class="col-6">Ширина, м <input type='number' name='window_width${k}' class='form-control is-invalid' step="any" required></div>
<div class="col-6">Висота, м <input type='number' name='window_height${k}' class='form-control is-invalid' step="any" required></div></div>`);
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
    CreatedRelatedList()
})
// $(document).on('change', '#related_list input', function () {
//     let val = this.value;
//     let type = null;
//     if (this.checked) {
//         if (val.includes('Короїд')) {
//             val = val.replace(/ 'Короїд'/, "");
//             type = 'Короїд';
//         }
//         if (this.value.includes('Камінцева')) {
//             val = val.replace(/ 'Камінцева'/, "");
//             type = 'Камінцева';
//         }
//
//         let sel = $(`.${this.id}`).removeClass('d-none').empty();
//         let relativeObject = findProductInJson(val);
//         if (type) {
//             relativeObject = relativeObject[type];
//         }
//         for (let key in relativeObject) {
//             if (key !== "Layers" && key !== "pre-packing" && key !== "Related_products") {
//                 sel.append($('<option>').attr('value', key).text(optionVal(key)))
//             }
//         }
//     } else {
//         $(`.${this.id}`).addClass('d-none')
//     }
// })

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
            $('#related_list').append($('<li></li>').text(relatedList[i]))
//             $('#related_list').append(`<div class="row align-items-center"><div class="col-sm-6 r${i}" ></div>
// <div class="col-sm-6"><select name="${relatedList[i]}" id="${relatedList[i]}" class="form-select related${i} d-none"></select></select></div></div>`)
//
//             $(`.r${i}`).append($('<input>').prop({
//                 type: 'checkbox',
//                 class: 'form-check-input',
//                 name: `related${i}`,
//                 id: `related${i}`,
//                 value: `${relatedList[i]}`
//             })).append($('<label></label>').prop({
//                 for: `related${i}`,
//                 class: 'ps-1 pb-2'
//             }).text(` ${relatedList[i]}`))
        }
    } else {
        $('#related_list').empty();
        $('.related_result').addClass('d-none');
    }
}

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
        $('#layers').text(product['Layers']);
    }

    //packing
    let packing = calculatePacking(product['pre-packing'], liter, measure);

    if (data['name'] === 'Interior Classic') {

        let img = $('<img />', {
            id: 'MyImg',
            src: `${product['IMG']}`,
            width: 100
        })
        $('#about').text(product['About'])
        $('#product_img').empty().prepend(img)
    } else {
        $('#about').empty()
        $('#product_img').empty()
        $('#quantity').text(packing)
    }
    // $('<img />', {
    //     id: 'MyImg',
    //     src: `${product['IMG']}`,
    //     width: 50
    // }).prepend($('#product_img'))
    $('.result-window').removeClass('d-none')
    // $('#result').text(liter.toFixed(1) + measure + ' або ' + packing);
    $('#result').text(liter.toFixed(1) + measure);
    $('#resultSquare').text(square);


    //related
    if ($('#related').is(':checked')) {
        $('#related_result').empty();
        let relatedArr = product['Related_products']
        // console.log(relatedArr)

        // let relatedArr = $("[id^=related]:not(#related):checked").map((_, el) => {
        //     return $(el).val()
        // }).toArray();
        //
        for (let i = 0; i < relatedArr.length; i++) {
            let searchName = relatedArr[i];
            let type = null;
            let key = relatedArr[i];
            if (key.includes('Короїд')) {
                type = 'Короїд';
                searchName = key.replace(/ 'Короїд'/, "");
            }
            if (key.includes('Камінцева')) {
                searchName = key.replace(/ 'Камінцева'/, "");
                type = 'Камінцева';
            }
            let relatedObject = findProductInJson(searchName);
            if (type) {
                relatedObject = relatedObject[type]
            }
            // console.log(relatedObject)
            let boolType = false;
            let expense = calculateAverage(relatedObject, boolType);
            if (Object.keys(relatedObject).includes('Fatness 0.5') || Object.keys(relatedObject).includes('Standard')) {
                boolType = true;
            }
            // console.log(expense, boolType)
            //
            let relatedLiter = 0;
            if (key.includes('Structura') || Object.keys(relatedObject).includes('Fatness 0.5') || key.includes('Décor') || Object.keys(relatedObject).includes('Standard')) {
                relatedLiter = (square * relatedObject['Layers']) * expense;
            } else {
                relatedLiter = (square * relatedObject['Layers']) / expense;
            }
            let relatedMeasure = "л";
            if (key.includes('Structura') || Object.keys(relatedObject).includes('Fatness 0.5') || key.includes('Décor') || key.includes('Guartz')) {
                relatedMeasure = "кг";
            }
            let relatedPacking = calculatePacking(relatedObject['pre-packing'], relatedLiter, relatedMeasure);
            let related_result = $('<p></p>').text(key + ": " + relatedLiter.toFixed(1) + relatedMeasure + " або " + relatedPacking).addClass('ms-3');
            $('#related_result').append(related_result);
        }
        $('.related_result').removeClass('d-none');
    }
})

function calculateAverage(obj, bool) {
    let average = 0;
    let size = 0;
    for (let key in obj) {
        if (key !== "pre-packing" && key !== "Layers" && key !== "Related_products" && key !== 'IMG' && key !== 'About') {
            average += obj[key];
            size++;
        }
        if (key.includes('Structura') || key.includes("Fatness")) {
            bool = true;
        }
    }
    return average / size;
}

//calculate packing
function calculatePacking(pre_packing, liter, measure) {
    let quantity = 0
    let result = '';
    let packingMap = new Map();
    for (let i = 0; i < pre_packing.length; i++) {
        packingMap.set(pre_packing[i], 0);
    }
    packingMap = Object.fromEntries(packingMap);
    for (let i = 0; i < pre_packing.length; i++) {
        if (pre_packing.length !== 1) {
            if (liter <= pre_packing[i]) {
                packingMap[pre_packing[i]] += 1;
                break;
            } else {
                if (i === pre_packing.length - 1) {
                    quantity = Math.trunc(liter / pre_packing[i]);
                    liter = liter - (quantity * pre_packing[i]);
                    packingMap[pre_packing[i]] += quantity;
                    if (liter !== 0) {
                        i = -1;
                    }
                }
            }
        } else {
            quantity = Math.trunc(liter / pre_packing[i]);
            liter = liter - (quantity * pre_packing[i]);
            if (liter !== 0) {
                quantity++;
            }
            packingMap[pre_packing[i]] += quantity;
            break;
        }
    }
    for (let key in packingMap) {
        if (packingMap[key] !== 0) {
            result += " " + packingMap[key] + ' x ' + key + measure;
        }
    }
    return result;
}


