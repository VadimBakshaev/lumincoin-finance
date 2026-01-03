import { RequestResultErrorType, RequestResultOperationType, RequestResultType } from "../types/request-result.type";
import request from "../utilities/http-utility";

export class Filter {
    private openRoute: (url: string) => Promise<void>;
    protected filterBoxEl: HTMLElement | null;
    protected titlePageEl: HTMLElement | null;
    private btnFilterEl: NodeListOf<Element>;
    private toDayBtnEl: HTMLElement | null;
    private fromDayBtnEl: HTMLElement | null;
    private collapseCalendarEl: HTMLElement | null;
    private yearCurrentEl: HTMLInputElement | null;
    private monthCurrentEl: HTMLElement | null;
    private prevMonthBtn: HTMLElement | null;
    private nextMonthBtn: HTMLElement | null;
    private tableMonthEl: HTMLElement | null;
    protected data: RequestResultOperationType[] | null;
    private toDay: Date | null;
    private fromDay: Date | null;
    private selectedDay: Date | null;
    private emitter: (() => void) | null;

    constructor(openRoute: (url: string) => Promise<void>) {
        this.openRoute = openRoute;
        this.filterBoxEl = document.getElementById('filterBox');
        this.titlePageEl = document.getElementById('titlePage');
        this.btnFilterEl = document.querySelectorAll('.filter');
        this.toDayBtnEl = document.getElementById('toDay');
        this.fromDayBtnEl = document.getElementById('fromDay');
        this.collapseCalendarEl = document.getElementById('collapseCalendar');
        this.yearCurrentEl = document.getElementById('yearCurrent') as HTMLInputElement;
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

    private init(): void {
        this.btnFilterEl.forEach((element: Element) => element.addEventListener('click', this.setActiveFilter.bind(this)));
        if (this.fromDayBtnEl && this.toDayBtnEl) {
            this.fromDayBtnEl.addEventListener('click', this.intervalBtnHandler.bind(this));
            this.toDayBtnEl.addEventListener('click', this.intervalBtnHandler.bind(this));
        }
        this.setFilter();
    }

    /**
     * Метод устанавливает управляющую функцию, которая будет выполнена при обновлении данных
     * @param {Function} func - управляющая функция
     */
    public setEmitter(func: () => void): void { this.emitter = func }

    private intervalBtnHandler(e: MouseEvent): void {
        if (e.target && e.target instanceof HTMLElement) {
            if (e.target.ariaExpanded === 'true') {
                this.showDatePicker(e.target);
            } else {
                this.selectedDay && (e.target.textContent = this.selectedDay.toLocaleDateString());
                if (e.target.id === 'toDay') this.toDay = this.selectedDay;
                if (e.target.id === 'fromDay') this.fromDay = this.selectedDay;
                this.selectedDay = new Date();
                this.setActiveFilter(null, true);
            }
        }
    }

    private setActiveFilter(e: Event | null, interval: boolean | null = null): void {
        this.btnFilterEl.forEach((element: Element) => element.classList.remove('active'));
        if (e && e.target instanceof HTMLElement) {
            if (interval) {
                const element: Element | undefined = [...this.btnFilterEl].find((btn: Element) => btn.id === 'interval');
                if (element) {
                    element.classList.add('active');
                    this.setFilter(element as HTMLElement);
                }
            } else {
                e.target.classList.add('active');
                this.setFilter(e.target as HTMLElement);
            }
        }
    }

    public async setFilter(element: HTMLElement | null = null): Promise<void> {
        let activeFilter: HTMLElement | null = null;
        if (element) {
            activeFilter = element;
        } else {
            activeFilter = [...this.btnFilterEl].find((element: Element) => element.classList.contains('active')) as HTMLElement;
        }
        let toDay: Date | null = new Date();
        let fromDay: Date | null = new Date();
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
            this.emitter && this.emitter();
        }
    }

    private async getData(filter: string): Promise<void> {
        const data: RequestResultType<RequestResultOperationType[] | RequestResultErrorType> | null = await request('/operations' + filter);
        if (data && data.status === 200) {
            this.data = data.response as RequestResultOperationType[];
        }
    }

    private showDatePicker(btnEl: HTMLElement): void {
        const counterMonth: () => (action?: number) => number = () => {
            let month: number = new Date().getMonth();
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
        const counterYear: () => (action?: number) => number = () => {
            let year: number = new Date().getFullYear();
            return (action = 0) => year += action;
        }
        const counterM: (action?: number | undefined) => number = counterMonth();
        const counterY: (action?: number | undefined) => number = counterYear();

        if (this.yearCurrentEl && this.prevMonthBtn && this.nextMonthBtn && this.tableMonthEl) {
            this.yearCurrentEl.onchange = () => {
                const newYear = +(this.yearCurrentEl!.value) - counterY();
                this.createDatePicker(counterM(), counterY(newYear));
            }
            this.prevMonthBtn.onclick = () => {
                this.createDatePicker(counterM(-1), counterY())
            }
            this.nextMonthBtn.onclick = () => {
                this.createDatePicker(counterM(1), counterY())
            }
            this.tableMonthEl.onclick = (e: MouseEvent) => {
                if (e.target instanceof HTMLElement && this.selectedDay) {
                    if (e.target.classList.contains('before')) {
                        this.selectedDay.setMonth(this.selectedDay.getMonth() - 1);
                        this.selectedDay.setDate(+e.target.textContent);
                    } else if (e.target.classList.contains('after')) {
                        this.selectedDay.setMonth(this.selectedDay.getMonth() + 1);
                        this.selectedDay.setDate(+e.target.textContent);
                    } else {
                        this.selectedDay.setDate(+e.target.textContent);
                    }
                    btnEl.dispatchEvent(new Event('click'));
                }
            }
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
    private createDatePicker(month: number, year: number, day: number | null = null): void {
        const monthName: string[] = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
        const firstOfMonth: Date = new Date();
        const lastOfMonth: Date = new Date();
        const toDay: number | null = firstOfMonth.getFullYear() === year && firstOfMonth.getMonth() === month ? new Date().getDate() : null;
        if (this.selectedDay) {
            this.selectedDay.setFullYear(year);
            this.selectedDay.setMonth(month);
            if (day) { this.selectedDay.setDate(day) } else if (toDay) { this.selectedDay.setDate(toDay) };
        }

        firstOfMonth.setFullYear(year);
        firstOfMonth.setMonth(month);
        firstOfMonth.setDate(1);
        lastOfMonth.setFullYear(year);
        lastOfMonth.setMonth(month + 1);
        lastOfMonth.setDate(1);
        lastOfMonth.setDate(lastOfMonth.getDate() - 1);

        if (this.monthCurrentEl && this.yearCurrentEl && this.tableMonthEl) {
            this.monthCurrentEl.textContent = monthName[month] as string;
            this.yearCurrentEl.value = `${year}`;
            this.tableMonthEl.innerHTML = this.showMonth(firstOfMonth, lastOfMonth, toDay, day);
        }
    }

    private showMonth(firstOfMonth: Date, lastOfMonth: Date, toDay: number | null, selectedDay: number | null): string {
        const beforeMonth: Date = new Date();
        beforeMonth.setFullYear(firstOfMonth.getFullYear());
        beforeMonth.setMonth(firstOfMonth.getMonth());
        beforeMonth.setDate(firstOfMonth.getDate() - 1);

        let table: string = `<thead>
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
        let dow: number = firstOfMonth.getDay();
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