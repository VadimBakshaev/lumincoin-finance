import { RequestResultOperationType } from "../types/request-result.type";
export declare class Filter {
    private openRoute;
    protected filterBoxEl: HTMLElement | null;
    protected titlePageEl: HTMLElement | null;
    private btnFilterEl;
    private toDayBtnEl;
    private fromDayBtnEl;
    private collapseCalendarEl;
    private yearCurrentEl;
    private monthCurrentEl;
    private prevMonthBtn;
    private nextMonthBtn;
    private tableMonthEl;
    protected data: RequestResultOperationType[] | null;
    private toDay;
    private fromDay;
    private selectedDay;
    private emitter;
    constructor(openRoute: (url: string) => Promise<void>);
    private init;
    /**
     * Метод устанавливает управляющую функцию, которая будет выполнена при обновлении данных
     * @param {Function} func - управляющая функция
     */
    setEmitter(func: () => void): void;
    private intervalBtnHandler;
    private setActiveFilter;
    setFilter(element?: HTMLElement | null): Promise<void>;
    private getData;
    private showDatePicker;
    private createDatePicker;
    private showMonth;
}
//# sourceMappingURL=filter.d.ts.map