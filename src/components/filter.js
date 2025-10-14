import request from "../utilities/http-utility";

export class Filter {
    constructor(openRoute) {
        this.openRoute = openRoute;
        this.filterBoxEl = document.getElementById('filterBox');
        this.titlePageEl = document.getElementById('titlePage');
        this.btnFilterEl = document.querySelectorAll('.filter');
        this.toDayBtnEl = document.getElementById('toDay');
        this.fromDayBtnEl = document.getElementById('fromDay');
        this.collapseCalendarEl = document.getElementById('collapseCalendar');
        this.yearCurrentEl = document.getElementById('yearCurrent');
        this.monthCurrentEl = document.getElementById('monthCurrent');
        this.prevMonthBtn = document.querySelector('.prev');
        this.nextMonthBtn = document.querySelector('.next');
        this.tableMonthEl = document.getElementById('tableMonth');
        this.data = null;
        this.toDay = null;
        this.fromDay = null;
        this.selectedDay = new Date();
        this.emitter = null;
        this.init();
    }
    init() {
        this.btnFilterEl.forEach(element => element.addEventListener('click', this.setActiveFilter.bind(this)));
        this.fromDayBtnEl.addEventListener('click', this.intervalBtnHandler.bind(this));
        this.toDayBtnEl.addEventListener('click', this.intervalBtnHandler.bind(this));
        this.setFilter();
    }
    /**
     * Метод устанавливает управляющую функцию, которая будет выполнена при обновлении данных
     * @param {Function} func - управляющая функция
     */
    setEmitter(func) { this.emitter = func }

    intervalBtnHandler(e) {
        if (e.target.ariaExpanded === 'true') {
            this.showDatePicker(e.target);
        } else {
            e.target.textContent = this.selectedDay.toLocaleDateString();
            if (e.target.id === 'toDay') this.toDay = this.selectedDay;
            if (e.target.id === 'fromDay') this.fromDay = this.selectedDay;
            this.selectedDay = new Date();
            this.setActiveFilter(0, true);
        }
    }
    setActiveFilter(e, interval = null) {
        this.btnFilterEl.forEach(element => element.classList.remove('active'));
        if (interval) {
            const element = [...this.btnFilterEl].find(btn => btn.id === 'interval');
            element.classList.add('active');
            this.setFilter(element);
        } else {
            e.target.classList.add('active');
            this.setFilter(e.target);
        }
    }
    async setFilter(element = null) {
        let activeFilter = null;
        if (element) {
            activeFilter = element;
        } else {
            activeFilter = [...this.btnFilterEl].find(element => element.classList.contains('active'));
        }
        let toDay = new Date();
        let fromDay = new Date();
        switch (activeFilter.id) {
            case 'day':
                fromDay.setDate(fromDay.getDate() - 1);
                break;
            case 'week':
                fromDay.setDate(fromDay.getDate() - 7)
                break;
            case 'month':
                fromDay.setMonth(fromDay.getMonth() - 1);
                break;
            case 'year':
                fromDay.setFullYear(fromDay.getFullYear() - 1);
                break;
            case 'all':
                fromDay.setFullYear(fromDay.getFullYear() - 30);
                break;
            case 'interval':
                toDay = this.toDay;
                fromDay = this.fromDay;
        }
        if (toDay && fromDay) {
            await this.getData(`?period=interval&dateFrom=
                ${fromDay.toISOString().split('T')[0]}&dateTo=
                ${toDay.toISOString().split('T')[0]}`);
            this.emitter();
        }
    }
    async getData(filter) {
        const data = await request('/operations' + filter);
        if (data && data.status === 200) {
            this.data = data.response;
        }
    }
    showDatePicker(btnEl) {
        const counterMonth = () => {
            let month = new Date().getMonth();
            return (action = 0) => {
                month += action;
                if (month < 0) {
                    counterY(-1);
                    month = 11;
                }
                if (month > 11) {
                    counterY(1);
                    month = 0
                }
                return month;
            }
        }
        const counterYear = () => {
            let year = new Date().getFullYear();
            return (action = 0) => year += action;
        }
        const counterM = counterMonth();
        const counterY = counterYear();

        this.yearCurrentEl.onchange = () => {
            const newYear = +(this.yearCurrentEl.value) - counterY();
            this.createDatePicker(counterM(), counterY(newYear));
        }
        this.prevMonthBtn.onclick = () => {
            this.createDatePicker(counterM(-1), counterY())
        }
        this.nextMonthBtn.onclick = () => {
            this.createDatePicker(counterM(1), counterY())
        }
        this.tableMonthEl.onclick = (e) => {
            if (e.target.classList.contains('before')) {
                this.selectedDay.setMonth(this.selectedDay.getMonth() - 1);
                this.selectedDay.setDate(e.target.textContent);
            } else if (e.target.classList.contains('after')) {
                this.selectedDay.setMonth(this.selectedDay.getMonth() + 1);
                this.selectedDay.setDate(e.target.textContent);
            } else {
                this.selectedDay.setDate(e.target.textContent);
            }
            btnEl.dispatchEvent(new Event('click'));
        }
        if (btnEl.id === 'fromDay' && this.fromDay) {
            counterY(this.fromDay.getFullYear() - counterY());
            counterM((this.fromDay.getMonth() + 1) - (counterM() + 1));
            this.createDatePicker(counterM(), counterY(), this.fromDay.getDate());
        } else if (btnEl.id === 'toDay' && this.toDay) {
            counterY(this.toDay.getFullYear() - counterY());
            counterM((this.toDay.getMonth() + 1) - (counterM() + 1));
            this.createDatePicker(counterM(), counterY(), this.toDay.getDate());
        } else {
            this.createDatePicker(counterM(), counterY());
        }
    }
    createDatePicker(month, year, day = null) {
        const monthName = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
        const firstOfMonth = new Date();
        const lastOfMonth = new Date();
        const toDay = firstOfMonth.getFullYear() === year && firstOfMonth.getMonth() === month ? new Date().getDate() : null;
        this.selectedDay.setFullYear(year);
        this.selectedDay.setMonth(month);
        if (day) { this.selectedDay.setDate(day) } else if (toDay) { this.selectedDay.setDate(toDay) };

        firstOfMonth.setFullYear(year);
        firstOfMonth.setMonth(month);
        firstOfMonth.setDate(1);
        lastOfMonth.setFullYear(year);
        lastOfMonth.setMonth(month + 1);
        lastOfMonth.setDate(1);
        lastOfMonth.setDate(lastOfMonth.getDate() - 1);

        this.monthCurrentEl.textContent = monthName[month];
        this.yearCurrentEl.value = year;
        this.tableMonthEl.innerHTML = this.showMonth(firstOfMonth, lastOfMonth, toDay, day);
    }
    showMonth(firstOfMonth, lastOfMonth, toDay, selectedDay) {
        const beforeMonth = new Date();
        beforeMonth.setFullYear(firstOfMonth.getFullYear());
        beforeMonth.setMonth(firstOfMonth.getMonth());
        beforeMonth.setDate(firstOfMonth.getDate() - 1);
        
        let table = `<thead>
                        <tr>
                            <th>Пн</th>
                            <th>Вт</th>
                            <th>Ср</th>
                            <th>Чт</th>
                            <th>Пт</th>
                            <th>Сб</th>
                            <th>Вс</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>`;
        let dow = firstOfMonth.getDay();
        if (dow === 0) dow = 7;
        for (let i = 1; i < dow; i++) {
            table += `<td class="before">${beforeMonth.getDate() - (dow - 1) + i}</td>`;
        }
        for (let day = 1; day <= lastOfMonth.getDate(); day++) {
            if (dow === 8) {
                table += `</tr><tr>`;
                dow = 1;
            }
            dow++
            switch (day) {
                case toDay:
                    table += `<td class="current">${day}</td>`;
                    break;
                case selectedDay:
                    table += `<td class="select">${day}</td>`;
                    break;
                default:
                    table += `<td>${day}</td>`;
            }
        }
        for (let i = dow; i < 8; i++) {
            table += `<td class="after">${1 + i - dow}</td>`;
        }
        table += `</tr></tbody>`;
        return table;
    }
}