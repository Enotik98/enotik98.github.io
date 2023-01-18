jQuery.fn.applyClass = function(className,apply){
    if( apply ){
        $(this).addClass(className);
    } else {
        $(this).removeClass(className);
    }
    return this;
}

let jsonObject;

fetch('./products.json')
    .then(res => res.json())
    .then(json => {
        window.json = json;
        let jsObj = json['Painting']
        for (let key in jsObj) {
            let option = $("<option></option>").text(key);
            $('#painting_type').append(option)
        }
        $('#painting_type').change(function () {
            painting_surface.length = 1;
            if (this.value === "Структурні фарби"){
                let opt1 = $("<option></option>").val("Small").text("Дрібна текстура");
                let opt2 = $("<option></option>").val("Average").text("Середня текстура");
                let opt3 = $("<option></option>").val("Deep").text("Глибока текстура");
                $('#painting_surface').append(opt1, opt2, opt3);
            }else {
                let opt1 = $("<option></option>").val("Structured").text("Структурні поверхні");
                let opt2 = $("<option></option>").val("Repainting").text("Перефарбування поверхні");
                let opt3 = $("<option></option>").val("Plasterer").text("Готові зашпакльовані поверхні");
                $('#painting_surface').append(opt1, opt2, opt3);
            }
            let name = jsObj[this.value];
            p_name.length = 0;
            for (let key in name) {
                let opt = $("<option></option>").text(key);
                $('.name').append(opt);
            }
        })


        $('#preparing_type').change(function () {
            let name = json['Preparing'][this.value];
            preparing_name.length = 0;
            for (let key in name) {
                let opt = $("<option></option>").text(key);
                $('#preparing_name').append(opt);
            }

            const condition = this.value === 'Putty';

            $('.surfaceSelect').applyClass('d-none', condition).attr('required', condition);
            $('.layersSelect').applyClass('d-none', !condition).attr('required', !condition);

        })

        jsonObject = json['Decorative'];
        for (let key in jsonObject){
            let opt = $("<option></option>").text(key);
            $('#decorative_name').append(opt);
        }
    })
$(document).on('change', '#decorative_name', function () {
    if (this.value === "Décor Mosaic"){
        $('#decorative_param').addClass('d-none');
    }else {
        $('#decorative_param').removeClass('d-none');
    }
    let type = jsonObject[this.value];
    decorative_type.length = 0;
    for (let key in type) {
        let opt = $("<option></option>").text(key);
        $('#decorative_type').append(opt);
    }
    $('#decorative_type').trigger('change')
})
$(document).on('change', '#decorative_type', function () {
    let fraction = jsonObject[$('#decorative_name').val()][this.value];
    decorative_fraction.length = 0;
    for (let key in fraction) {
        if (key === 'pre-packing') continue;
        let opt = $("<option></option>").text(key);
        $('#decorative_fraction').append(opt);
    }
})
