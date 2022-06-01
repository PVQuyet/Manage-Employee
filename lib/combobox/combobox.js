$(document).ready(function () {

    new MCombobox();

    //Khởi tạo sự kiện cho nút button để show combobox
    $('.mcombobox .m-combobox-button').click(btnOnClick);
    $('.mcombobox').on('click', '.m-combobox-item', itemOnClick);
    $('.mcombobox input').keydown(inputKeyDown);
    $('.mcombobox input').keyup(inputKeyUp);

    //Lưu trữ thông tin combobox dât:
    let comboboxs = $('.mcombobox');
    for (const combobox of comboboxs) {
        //Khai báo các thuộc tính cho combobox
        let api = $(combobox).attr('api');
        let propertyDisplay = $(combobox).attr('propertyDisplay');
        let proppertyValue = $(combobox).attr('propertyValue');

        //Kiểm tra xem dữ liệu có tồn tại hay không
        if (api && propertyDisplay && proppertyValue) {
            //Gọi lên JAjex để lấy dự liệu phòng ban
            $.ajax({
                type: "GET",
                url: api,
                success: function (data) {
                    //Duyệt từng phần tử trong mảng
                    for (const item of data) {
                        let text = item[propertyDisplay];
                        let value = item[proppertyValue];
                        let comboboxItem = `<div class="m-combobox-item" value="${value}">${text}</div>`
                        $(combobox).find('.m-combobox-data').append(comboboxItem);
                    }
                }
            });
        }

        // Lưu trữ thông tin cần thiết
        let ItemDataElements = $(combobox).find('.m-combobox-data').html();
        $(combobox).data("ItemDataElement", ItemDataElements);
        //$(combobox).find('.m-combobox-data').empty();
    }
})

class MCombobox {
    constructor() {
        this.ComboboxAuto();
    }
    ComboboxAuto() {
        //Lấy ra tất cả các combobox
        let comboboxs = $('combobox');
        //Duyệt từng combobox
        for (const combobox of comboboxs) {
            //Lấy ra các dữ liệu cân thiết
            let api = $(combobox).attr('api');
            let propertyDisplay = $(combobox).attr('propertyDisplay');
            let proppertyValue = $(combobox).attr('propertyValue');
            let id = $(combobox).attr('id');
            let fieldName = $(combobox).attr('fieldName');
            let placehoder = $(combobox).attr('placeholder');
            let a =  $(combobox).attr('a')

            //Build khung chứa
            let comboboxHTML = $(`<div mcombobox id="${id}||''" class="mcombobox" fieldName="${fieldName}">
                                        <input class="m-combobox" type="text" class="m-combobx-input" fieldName="${a}">
                                        <button class="m-combobox-button"><i class="fas fa-chevron-down"></i></button>
                                        <div class="m-combobox-data"></div>
                                    </div>`);
            comboboxHTML.data('fieldName', fieldName);
            comboboxHTML.data('a', a);
            if (api && propertyDisplay && proppertyValue) {
                //Gọi lên JAjex để lấy dự liệu phòng ban
                $.ajax({
                    type: "GET",
                    url: api,
                    async: false,
                    success: function (data) {
                        //Duyệt từng phần tử trong mảng
                        for (const item of data) {
                            let text = item[propertyDisplay];
                            let value = item[proppertyValue];
                            let comboboxItem = `<div class="m-combobox-item" value="${value}">${text}</div>`
                            $(comboboxHTML).find('.m-combobox-data').append(comboboxItem);
                            $(comboboxHTML).find('.m-combobox').val(placehoder);
                        }

                        //$(combobox).replaceWith(comboboxHTML);
                    }
                });
            }
            else {
                let items = $(combobox).children('item');
                for (const item of items) {
                    const text = item.textContent;
                    const value = item.getAttribute('value');
                    let itemHTML = `<item class="m-combobox-item" value="${value}">${text}</item>`
                    $(comboboxHTML).find('.m-combobox-data').append(itemHTML);
                }
            }
            $(combobox).replaceWith(comboboxHTML);
        }
    }
}

function inputKeyUp() {
    //Loại bỏ một sô phím đặc biệt
    switch (event.keyCode) {
        case 13:
        case 40:
        case 38:
        case 8:
            break;
        default:
            let ItemDataElement = $(this.parentElement).data('ItemDataElement');
            $(this).siblings('.m-combobox-data').html(ItemDataElement);
            //Lấy ra value nhập ở ô input
            const valueInput = this.value;
            //Lấy ra tất cả item của combobox-data
            let items = $(this).siblings('.m-combobox-data').children();
            //Duyệt từng phần tử để so sánh với value input (so sánh chữ đầu)
            for (const item of items) {
                let text = item.textContent;
                if (!text.toLowerCase().includes(valueInput.toLowerCase())) {
                    item.remove();
                }
            }
            $(this).siblings('.m-combobox-data').show();
            break;
    }

}
function inputKeyDown() {
    //Lấy tất cả các item của combobox-data
    let items = $(this).siblings('.m-combobox-data').children();
    //Kiểm tra xem có item nào đã được hover chưa
    let itemHovered = items.filter('.m-combobox-hover');
    switch (event.keyCode) {
        case 40: //Nhấn mũi tên xuống
            //Hiển thị combobox-data của combobox hiện tại
            $(this).siblings('.m-combobox-data').show();
            //Nếu đã có item được chọn thì chọn item kế tiếp
            if (itemHovered.length == 1) {
                //Lấy item kế tiếp
                let nextItem = itemHovered.next();
                //gán class hover cho item kế tiếp
                $(nextItem).addClass("m-combobox-hover");
                //Xóa class hover cho item trước đó
                itemHovered.removeClass("m-combobox-hover");
            }
            //Nếu chưa có item được chọn thì chọn item đầu tiên
            else {
                //Lấy item đầu tiên của combobox-data
                let firstItem = items[0];
                //Gán thêm class vào item đầu tiên
                $(firstItem).addClass('m-combobox-hover');
            }

            break;

        case 38: //Nhấn mũi tên lên
            //Hiển thị combobox-data của combobox hiện tại
            $(this).siblings('.m-combobox-data').show();
            //Nếu đã có item được chọn thì chọn item trước nó
            if (itemHovered.length == 1) {
                //Lấy item trước item đang chọn
                let beforeItem = itemHovered.prev();
                //gán class hover cho item đắng trước
                $(beforeItem).addClass("m-combobox-hover");
                //Xóa class hover cho item trước đó
                itemHovered.removeClass("m-combobox-hover");
            }
            //Nếu chưa có item được chọn thì chọn item cuối cùng
            else {
                //Lấy item cuối cùng của combobox-data
                let lastItem = items[items.length - 1];
                $(lastItem).addClass('m-combobox-hover');
            }
            break;

        case 13: //Ấn Enter để gán text và value cho input
            //Gán text
            //Lấy ra thẻ cha đang chưa text
            let parentElement = $(this).siblings(".m-combobox-data");
            //Lấy ra text của element được chọn
            const text = parentElement.children(".m-combobox-hover").text();
            //Gán text cho input
            $(this).val(text);


            //Gán value
            //Lấy ra value
            const value = parentElement.children(".m-combobox-hover").attr('value');
            //Tìm Combobox cha chưa item
            const parentComboboxElement = $(this).parents(".mcombobox")
            //Gán value cho combobox
            //parentComboboxElement.attr('value', value);
            parentComboboxElement.data('value', value);

            //Ẩn combobox-data
            $(this).siblings(".m-combobox-data").hide();
            break;

        default:
            break;
    }
}

function btnOnClick() {
    // Hiển thị đúng combobox-data của combobox được chọn
    //1. Xác định combobox-data của combobox hiện tại
    const comboboxData = $(this).siblings('.m-combobox-data');
    //2. Hiển thị combobox data được chọn
    comboboxData.toggle();
}
function itemOnClick() {
    //Gán text của item được chọn cho input
    //1. Lấy ra text của item được chọn
    const text = $(this).text();
    //2. Gán text cho input được chọn
    //2.1 Lấy ra thẻ cha của item được chọn
    var parentElement = this.parentElement;
    //2.2 Lấy ra thẻ input ngang cấp với thẻ cha của item được chọn và gán text
    $(parentElement).siblings('input').val(text);

    //Gán value cho combobox
    //1. Lấy ra value của item được chọn
    const value = $(this).attr('value');
    //2. Tìm ra combobox cha chứa item
    const parentComboboxElement = $(this).parents('.mcombobox');
    //3. Gán value cho combobox cha
    //cách 1: parentComboboxElement.attr('value', value);
    parentComboboxElement.data('value', value);
    // Ẩn combobox data
    $(parentElement).hide();
}