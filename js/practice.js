(function($) {
    $.fn.practice = function(options) {
        let config = $.extend({}, {}, options);

        function main(e) {
            let db = [];
            let copy = [];
            
            function get_id(phone) {
                return phone.replace(/[ +()]/g,'');
            }
            
            function sort() {
                copy = [];
                for (let i = 0; i < db.length; i++){
                    copy[i] = db[i];
                }

                copy.sort((a, b) => a[0].toLowerCase() > b[0].toLowerCase() ? 1 : -1);

                for (let i = 0; i < copy.length; i++){
                    for (let j = 0; j < copy.length-1; j++){
                        if (copy[j][2] < copy[j + 1][2]) {
                            let q = copy[j];
                            copy[j] = copy[j + 1];
                            copy[j + 1] = q;
                        }
                    }
                }
            }
            
            function sort_search(info) {
                copy = [];
                let j = 0;

                for (let i = 0; i < db.length; i++){            

                    let one = db[i][0].toLowerCase();
                    let two = info.toLowerCase();

                    if(one.search(two) != -1) {
                        copy[j] = db[i];
                        j++;
                    }
                }

                copy.sort((a, b) => a[0].toLowerCase() > b[0].toLowerCase() ? 1 : -1);

                for (let i = 0; i < copy.length; i++){
                    for (let j = 0; j < copy.length-1; j++){
                        if (copy[j][2] < copy[j + 1][2]) {
                            let q = copy[j];
                            copy[j] = copy[j + 1];
                            copy[j + 1] = q;
                        }
                    }
                }

            }
            
            function search() {
                let errorSearch = 0;
                let search = e.find('.search__input').val();

                if (db.length) {
                    if (search.length >= 15) {
                        alert("Строка поиск больше 15 символов");
                        errorSearch++;
                    }else {
                        if (!/^[A-ZА-ЯЁ]+$/i.test(search)) {
                            alert("Строка поиск некорректена");
                            errorSearch++;
                        }
                    }
                }

                if(errorSearch == 0) {
                    sort_search(search);
                    output(copy);
                }

                if (!copy.length) {
                    e.find('#row').html("<span class='row-span'>Not found...</div>");
                }
            }
            
            function output(ar) {
                e.find('#row').html('');

                for (let i = 0; i < ar.length; i++){

                    (ar[i][2] > 0) ? heart = 'fa-heart' : heart = 'fa-heart-o';

                    e.find('#row').append(
                        '<div class="contact" id="' + get_id(ar[i][1]) + '">' +
                            '<img class="contact__icon" src="img/icon.png" alt="Контакт">' +
                            '<div class="contact__content">' +
                                '<h4 class="contact__h4">' + ar[i][0] + '</h4>' +
                                '<p class="contact__p">' + ar[i][1] + '</p>' +
                            '</div>' +
                            '<div class="contact__btn">' +
                                '<i  class="fa fa-times fa-btn contact__i practice-delete" aria-hidden="true" data-id="' + ar[i][1] + '"></i>' +
                                '<i class="fa ' + heart  + ' fa-btn contact__i practice-like" aria-hidden="true" data-id="' + ar[i][1] + '"></i>' +
                            '</div>' +
                        '</div>'
                    );
                }

            }
            
            e.on('click','.practice-like',function(){
                let id = $(this).data('id');
                for(let i = 0; i < db.length; i++)
                    if(id == db[i][1])
                        db[i][2] = !db[i][2];
                sort();
                output(copy);
            });
            
            e.on('click','.practice-delete',function(){
                let id = $(this).data('id');
                for(let i = 0; i < db.length; i++) {
                    if(db[i][1] == id ){
                        db.splice(i, 1);
                        e.find('#'+get_id(id)).remove();
                    }
                } 

                if (db.length === 0)
                    e.find('#row').html("<span class='row-span'>Not found...</div>");

                for (let i = 0; i < db.length; i++)
                    copy[i] = db[i];
            });
            
//            e.find('.search__input').bind('input focus blur keydown',function() {
//                search();
//            });
            
            e.find('.input__phone').bind('input focus blur keydown',function(event) {
                let keyCode;
                event.keyCode && (keyCode = event.keyCode);
                var pos = this.selectionStart;
                if (pos < 3) event.preventDefault();
                var matrix = "+7 (___) ___ ____",
                    i = 0,
                    def = matrix.replace(/\D/g, ""),
                    val = this.value.replace(/\D/g, ""),
                    new_value = matrix.replace(/[_\d]/g, function(a) {
                        return i < val.length ? val.charAt(i++) || def.charAt(i) : a
                    });
                i = new_value.indexOf("_");
                if (i != -1) {
                    i < 5 && (i = 3);
                    new_value = new_value.slice(0, i)
                }
                var reg = matrix.substr(0, this.value.length).replace(/_+/g,
                    function(a) {
                        return "\\d{1," + a.length + "}"
                    }).replace(/[+()]/g, "\\$&");
                reg = new RegExp("^" + reg + "$");
                if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
                if (event.type == "blur" && this.value.length < 5)  this.value = ""
            });
            
            e.find('.practice-search').click(function() {
                let errorSearch = 0;
                let search = e.find('.search__input').val();
                
                if (db.length) {
                    if(!search) {
                        alert("Строка поиск пустая");
                        errorSearch++;
                    }else {
                        if (search.length >= 15) {
                            alert("Строка поиск больше 15 символов");
                            errorSearch++;
                        }else {
                            if (!/^[A-ZА-ЯЁ]+$/i.test(search)) {
                                alert("Строка поиск некорректена");
                                errorSearch++;
                            }
                        }
                    }
                }

                if(errorSearch == 0) {
                    sort_search(search);
                    output(copy);
                }

                if (!copy.length) e.find('#row').html("<span class='row-span'>Not found...</div>");
            });
            
            e.find('.practice-contact').click(function() {
                if (db.length === 0){
                    e.find('#row').html("<span class='row-span'>Not found...</div>");
                } else {
                    sort();
                    output(copy);
                }
            });
            
            e.find('.practice-add').click(function() {
                e.find('#modal').css({'display':'flex'});
                e.find('#book').css({'display':'none'});
            });
            
            e.find('.practice-create').click(function() {
                let name = e.find('#input__name').val();
                let phone = e.find('#input__phone').val();
                let like = e.find('#like').is(':checked');

                let errorName = 0;
                let errorPhone = 0;

                if(!name) {
                    alert("Имя пустое");
                    errorName++;
                }else {
                    if(!/^[A-ZА-ЯЁ]+$/i.test(name)) {
                        alert("Имя некорректно");
                        errorName++;
                    }else {
                        if (name.length > 11) {
                            alert("Слишком длинное имя");
                            errorName++;
                        }
                    }
                }

                if(!phone) {
                    alert("Номер не заполнен");
                    errorPhone++;
                }else {
                    if (phone.length < 17) {
                        alert("Слишком короткий номер телефона");
                        errorPhone++;
                    }else {
                        for(let i = 0; db.length > i; i++) {
                            if(db[i][1] == phone){
                                alert("Номер телефона уже зарегистрирован");
                                errorPhone++;
                            }
                        } 
                    }
                }

                if(errorName == 0 && errorPhone == 0) {
                    db.push([name, phone, like]);

                    sort();
                    output(copy);

                    e.find('#input__name').val('');
                    e.find('#input__phone').val('');
                    e.find('#like').prop('checked', false);

                    e.find('#modal').css({'display':'none'});
                    e.find('#book').css({'display':'flex'});
                }
            });
        }
        this.each(function() {
            main($(this));
        });
        return this;
    };
})(jQuery);


