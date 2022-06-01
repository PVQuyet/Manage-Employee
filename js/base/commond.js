


class Commond {
    static formatDDMMYYY(date) {
        if (date) {
            const newDate = new Date(date);
            let day = newDate.getDate();
            let month = newDate.getMonth() + 1;
            let year = newDate.getFullYear();
            day = (day < 10 ? `0${day}` : day);
            month = (month < 10 ? `0${month}` : month);
            return `${year}-${month}-${day}`;
        }
        else return "";
    }

    static formatCurrence(salary){
        const newSalary = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(salary);
        return newSalary;
    }
}