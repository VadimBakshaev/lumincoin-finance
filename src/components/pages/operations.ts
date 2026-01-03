import { RequestResultOperationType } from "../../types/request-result.type";
import request from "../../utilities/http-utility";
import { Filter } from "../filter";
import { Layout } from "../layout";

export class Operations extends Filter {
    private delBtnEl: HTMLElement | null;
    private tableEl: HTMLElement | null;

    constructor(openRoute: (url: string) => Promise<void>) {
        super(openRoute);
        this.delBtnEl = document.getElementById('delBtn');
        this.tableEl = null;
        this.initTable();
    }

    private initTable(): void {
        if (this.titlePageEl && this.filterBoxEl) {
            this.titlePageEl.innerText = 'Доходы и расходы';
            this.titlePageEl.insertAdjacentHTML('afterend', `<a href="/create-expense" class="btn btn-danger fs-7">Создать расход</a>`);
            this.titlePageEl.insertAdjacentHTML('afterend', `<a href="/create-income" class="btn btn-success fs-7 me-2">Создать доход</a>`);
            this.filterBoxEl.insertAdjacentHTML('beforeend', this.createTableHead());
        }
        this.tableEl = document.getElementById('tableContent');
        this.setEmitter(this.showTable.bind(this));
    }

    public showTable(): void {
        if (this.data) {
            this.tableEl && (this.tableEl.innerHTML = '');
            this.data.forEach((item: RequestResultOperationType, index: number) => {
                if (this.tableEl && item) {
                    this.tableEl && this.tableEl.insertAdjacentHTML('beforeend', this.createTableRow(index + 1, item.id, item.type, item.category, item.amount, item.date, item.comment))
                };
            });
            document.querySelectorAll('.del-btn').forEach((elem: Element) => elem.addEventListener('click', (e: Event) => {
                this.delBtnEl && (this.delBtnEl.onclick = async () => {
                    if (e.target && e.target instanceof HTMLElement && e.target.parentNode)
                        await request('/operations/' + (e.target.parentNode as HTMLElement).id, 'DELETE');
                    new Layout().getBalance();
                    this.setFilter();
                })
            }));
        }
    }

    private createTableRow(
        num: number,
        id: number | undefined,
        type: string | undefined,
        category: string | undefined,
        amount: number | undefined,
        date: string | undefined,
        comment: string | undefined
    ): string {
        return `<tr>
                    <th scope="row">${num}</th>
                    <td class="${type === 'income' ? 'text-success' : 'text-danger'}">${type === 'income' ? 'доход' : 'расход'}</td>
                    <td>${category ? category : 'Без категории'}</td>
                    <td>${amount}$</td>
                    <td>${date && new Date(date).toLocaleDateString()}</td>
                    <td>${comment}</td>
                    <td>
                        <a href="#!" class="text-secondary del-btn" data-bs-toggle="modal" data-bs-target="#modalDialog" id="${id}"><i class="bi bi-trash"></i></a>
                        <a href="/edit-${type}?id=${id}" class="text-secondary edit-btn"><i class="bi bi-pencil"></i></a>
                    </td>
                </tr>`
    }

    private createTableHead(): string {
        return `<div class="box border-top">
            <table class="table text-center">
                <thead class="text-nowrap">
                    <tr>
                        <th scope="col">№ операции</th>
                        <th scope="col">Тип</th>
                        <th scope="col">Категория</th>
                        <th scope="col">Сумма</th>
                        <th scope="col">Дата</th>
                        <th scope="col">Комментарий</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody id="tableContent"> 
                </tbody>
            </table>
        </div>`
    }
}