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

            const condition = this.value === 'Undercoat';

            $('.surfaceSelect').applyClass('d-none', !condition).attr('required', !condition);
            $('.layersSelect').applyClass('d-none', condition).attr('required', condition);

        })

        jsonObject = json['Decorative'];
        for (let key in jsonObject){
            let opt = $("<option></option>").text(key);
            $('#decorative_name').append(opt);
        }
    })
$(document).on('change', '#decorative_name', function () {
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
        let opt = $("<option></option>").text(key);
        $('#decorative_fraction').append(opt);
    }
})
