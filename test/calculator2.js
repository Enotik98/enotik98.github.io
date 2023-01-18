//start
$('#preparing, #decorative').hide()
$('.painting, .preparing, .decorative').click(function (e) {
    e.preventDefault();
    $('.form-param').removeClass('active');
    $(this).addClass('active');
    const target = $(this).data('target');
    $('#painting, #preparing, #decorative').hide();
    $(`#${target}`).show();
    $('.result-window').addClass('d-none');
})

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
        $(this).removeClass('is-invalid').addClass('is-valid');
        $('#square').addClass('d-none').removeAttr('required');
        $('.squareLabel').addClass('d-none');
    } else {
        $(this).addClass('is-invalid');
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

//submit and calculate
$('.sub').click(function (e) {
    // e.preventDefault();
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
    if ($('#painting').is(':visible')) {
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
    if ($('#preparing').is(':visible')) {
        product = product['Preparing'][data['preparing_type']][data['name']];
        // console.log(product)
        if ('Undercoat' !== data['preparing_type']) measure = 'кг';
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
    if ($('#decorative').is(':visible')) {
        product = product['Decorative'][data['decorative_name']][data['decorative_type']];
        liter = square * product[data['fraction']];
        measure = 'кг';
        $('#current').text(data['decorative_name']);
        $('#layers').text(1);
    }
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
                temp = (temp / pre_packing[i]) - quantity;
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
                quantity ++;
            }
            packing += quantity + ' x ' + pre_packing[i] + measure;
            break;
        }

    }
    console.log(product['pre-packing'])
    $('.result-window').removeClass('d-none')
    $('#result').text(liter.toFixed(1) + measure + ' або ' + packing);
    $('#resultSquare').text(square);

})


