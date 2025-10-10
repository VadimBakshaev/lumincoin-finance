import request from "../../utilities/http-utility";
import { Filter } from "../filter";
import { Layout } from "../layout";

export class Operations extends Filter {
    constructor(openRoute) {
        super(openRoute);
        this.delBtnEl = document.getElementById('delBtn');        
        this.initTable();
    }
    initTable() {
        this.titlePageEl.innerText = 'Доходы и расходы';
        this.titlePageEl.insertAdjacentHTML('afterend', `<a href="/create-expense" class="btn btn-danger fs-7">Создать расход</a>`);
        this.titlePageEl.insertAdjacentHTML('afterend', `<a href="/create-income" class="btn btn-success fs-7 me-2">Создать доход</a>`);
        this.filterBoxEl.insertAdjacentHTML('beforeend', this.createTableHead());
        this.tableEl = document.getElementById('tableContent');
        this.setEmitter(this.showTable.bind(this));        
    }
    showTable() {
        if (this.data) {
            this.tableEl.innerHTML = '';
            this.data.forEach((item, index) => {
                this.tableEl.insertAdjacentHTML('beforeend', this.createTableRow(index + 1, item.id, item.type, item.category, item.amount, item.date, item.comment));
            });
            document.querySelectorAll('.del-btn').forEach(elem => elem.addEventListener('click', (e) => {
                this.delBtnEl.onclick = async () => {
                    await request('/operations/' + e.target.parentNode.id, 'DELETE');
                    new Layout().getBalance();
                    this.setFilter();
                }
            }));
        }
    }
    createTableRow(num, id, type, category, amount, date, comment) {
        const dateLocal = new Date(date).toLocaleDateString();
        return `<tr>
                    <th scope="row">${num}</th>
                    <td class="${type === 'income' ? 'text-success' : 'text-danger'}">${type === 'income' ? 'доход' : 'расход'}</td>
                    <td>${category}</td>
                    <td>${amount}$</td>
                    <td>${dateLocal}</td>
                    <td>${comment}</td>
                    <td>
                        <a href="#!" class="text-secondary del-btn" data-bs-toggle="modal" data-bs-target="#modalDialog" id="${id}"><i class="bi bi-trash"></i></a>
                        <a href="/edit-${type}?id=${id}" class="text-secondary edit-btn"><i class="bi bi-pencil"></i></a>
                    </td>
                </tr>`
    }
    createTableHead() {
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