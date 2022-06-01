$(document).ready(function(){
    new EmployeePage;
})

class EmployeePage {
    FormMode = null;
    employeeIdSelected = null;
    constructor() {
        this.loadData();
        this.intitEvent();
    }

    loadData() {
        //Clear dữ liệu cũ
        $('table#tblEmployee tbody').empty();
        //Gọi lên api để lấy dữ liệu về -> sử dụng Jajex
        $.ajax({
            type: "GET",
            url: "http://cukcuk.manhnv.net/api/v1/Employees",
            success: function (response) {
                //Nếu mà dữ liệu tồn tại mới làm việc
                if (response) {
                    //Gán employees là response
                    let employees = response;
                    //Duyệt từng phần tử có trong mảng employees
                    for (const employee of employees) {
                        //Biuld thành thẻ tr HTML
                        var trHTML = $(`<tr>
                                        <td class="text-align-left">${employee.EmployeeCode || ""}</td>
                                        <td class="text-align-left">${employee.FullName || ""}</td>
                                        <td class="text-align-center">${Commond.formatDDMMYYY(employee.DateOfBirth)}</td>
                                        <td class="text-align-center">${employee.GenderName || ""}</td>
                                        <td class="text-align-left">${employee.PhoneNumber || ""}</td>
                                        <td class="text-align-left">${employee.Email || ""}</td>
                                        <td class="text-align-left">${employee.PositionName || ""}</td>
                                        <td class="text-align-left">${employee.DepartmentName || ""}</td>
                                        <td class="text-align-right">${Commond.formatCurrence(employee.Salary) || ""}</td>
                                        <td class="text-align-left">${employee.Address || ""}</td>
                                    </tr>`);
                        //Lưu trữ dữ liệu
                        trHTML.data('employeeId', employee.EmployeeId);
                        trHTML.data('data', employee);
                        //append vào table
                        $('table#tblEmployee tbody').append(trHTML);
                    }
                }
            }
        });

    }

    intitEvent(){
        //Gán sự kiến loadData cho nút load
        $('#loadEmployeePage').click(this.loadData);

        //Gán sự kiến nhấn nút Thêm nhân viên
        $('#btnAddEmployee').click(this.btnAddOnClick.bind(this));

         //Gán sự kiến cho nút Lưu
         $('#btnSave').click(this.btnSaveOnClick.bind(this));

        //Gán sự kiện cho nút HỦY
        $('#btnClose').click(this.btnCloseOnClick);

        //Gán sự kiện cho nút X 
        $('#btnCloseDialog').click(this.btnCloseOnClick);

        //Gán sự kiện khi double click vào từng dòng thì sẽ hiển thị thông tin lên form chi tiết
        $('table#tblEmployee tbody').on('dblclick', 'tr', this.rowdbOnClick.bind(this));

        //Gán sự kiện khi click vào 1 dòng của table
        $('table#tblEmployee tbody').on('click', 'tr', this.rowOnClick.bind(this));

        //Gán sự kiện cho nút xóa
        $('#btnDelete').click(this.delete.bind(this));

       
        
    }
    
    rowOnClick(sender){
        let currentRow = sender.currentTarget;
        let employeeId = $(currentRow).data('employeeId');
        $(currentRow).siblings().removeClass('m-currentRow-selected');
        $(currentRow).addClass('m-currentRow-selected');
        this.employeeIdSelected = employeeId;
    }

    rowdbOnClick(sender){
        this.FormMode = Enum.FormMode.Update;
        let currentRow = sender.currentTarget;
        let employeeId = $(currentRow).data('employeeId');
        this.employeeIdSelected = employeeId;
        //build thông tin thông qua Jajex
        $.ajax({
            type: "GET",
            url: `http://cukcuk.manhnv.net/api/v1/Employees/${employeeId}`,
            async: false,
            success: function (employee) {
                //1- Lấy ra tất cả các input[fildName]
                let inputs = $('input[fieldName]');
                //2- Duyệt từng input trong mảng inputs
                for (const input of inputs) {
                    let fieldName = $(input).attr('fieldName');
                    let value = employee[fieldName];
                    if (fieldName == "DateOfBirth")
                    {
                        value = Commond.formatDDMMYYY(employee[fieldName]);
                        if (value)
                            input.value = value;
                    }
                    if(value)
                        input.value = value;
                    else
                    input.value = null;
                }
        
        // build thông tin Combobox
        $.ajax({
            type: "GET",
            url: `http://cukcuk.manhnv.net/api/v1/Employees/${employeeId}`,
            success: function (employee) {
                let comboboxs = $('#dlgPopup div[mcombobox] input');
                for (const combobox of comboboxs) {
                    let fieldName = $(combobox).attr('fieldname');
                    let value = $(combobox).data('a');
                    if(value)
                        combobox.value = value;
                }
            }
        });


                // $('#txtEmployeeCode').val(response.EmployeeCode);
                // $('#txtFullName').val(response.EmployeeName);
                // //$('#dbDateOfBirth').val(response.EmployeeCode);
                // //$('#txtEmployeeCode').val(response.EmployeeCode);
                // $('#txtPhoneNumber').val(response.TelephoneNumber);
                // $('#txtEmail').val(response.Email);
                // //$('#txtEmployeeCode').val(response.EmployeeCode);
                // //$('#txtEmployeeCode').val(response.EmployeeCode);
                // $('#numSalary').val(response.Salary);
                // $('#txtAddress').val(response.Address);

                //Hiển thị dialog
                $('#dlgPopup').show();
            }
        });
    }

    btnAddOnClick(){
        this.FormMode = Enum.FormMode.Add;
        //Xóa tát cả các ô dữ liệu đã nhập trước đó
        $('input').val(null);
        //Lấy mã nhân viên vào ô mã nhân viên
        $.ajax({
            type: "GET",
            url: "http://cukcuk.manhnv.net/api/v1/Employees/NewEmployeeCode",
            success: function (response) {
                $('#txtEmployeeCode').val(response);
            }
        });
        //Hiển thị dialog
        $('#dlgPopup').show();
    }

    btnSaveOnClick(){
        var me = this;
        //1- Lấy ra tất cả các input[fildName]
        let inputs = $('input[fieldName]');
        //2- Duyệt từng input trong mảng inputs
        let employee = {};
        for (const input of inputs) {
            let fieldName = $(input).attr('fieldName');
            let value = input.value;
            if(value)
                employee[fieldName] = value;
        }

        //Duyệt các combobox
        let comboboxs = $('#dlgPopup div[mcombobox]');
        for (const combobox of comboboxs) {
            const fieldName = $(combobox).attr('fieldName');
            const vale = $(combobox).data('value');
            if (fieldName) {
                employee[fieldName] = vale;
            }
        }
        if(this.FormMode == Enum.FormMode.Add)
        {
            $.ajax({
                type: "POST",
                url: "http://cukcuk.manhnv.net/api/v1/Employees",
                data: JSON.stringify(employee),
                dataType: "json",
                async: false,
                contentType: "application/json",
                success: function (response) {
                    //Load lại dữ liệu
                    me.loadData();
                    //Ẩn form chi tiết
                    $('#dlgPopup').hide();
                }
            });
        }
        else{
            $.ajax({
                type: "PUT",
                url: `http://cukcuk.manhnv.net/api/v1/Employees/${this.employeeIdSelected}`,
                data: JSON.stringify(employee),
                dataType: "json",
                async: false,
                contentType: "application/json",
                success: function (response) {
                    //Load lại dữ liệu
                    me.loadData();
                    //Ẩn form chi tiết
                    $('#dlgPopup').hide();
                }
            });
        }
    }

    delete(sender){
        let me = this;
        $.ajax({
            type: "DELETE",
            url: `http://cukcuk.manhnv.net/api/v1/Employees/${this.employeeIdSelected}`,
            success: function (response) {
                $('#toast-smg-show').fadeIn();
                setTimeout(() => {
                    $('#toast-smg-show').fadeOut();
                }, 2000);

                //load lại dữ liệu
                me.loadData();
            }
        });
    }

    btnCloseOnClick(){
        $('#dlgPopup').hide();
    }
}