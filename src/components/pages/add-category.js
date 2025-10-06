import request from "../../utilities/http-utility";
import { ValidateUtility } from "../../utilities/validate-utility";

export class AddCategory {
    constructor(openRoute, category) {
        this.openRoute = openRoute;
        this.category = category;
        this.titleEl = document.getElementById('titlePage');
        this.btnAddEl = document.getElementById('btnAction');
        this.btnCancelEl = document.getElementById('btnCancel');
        this.formEls = document.querySelectorAll('.form-control');
        this.init();
    }
    init() {
        if (this.category === 'income') {
            this.titleEl.innerText = 'Создание категории доходов';
            this.btnCancelEl.href = '/income';
        }
        if (this.category === 'expense') {
            this.titleEl.innerText = 'Создание категории расходов';
            this.btnCancelEl.href = '/expense';
        }
        this.btnAddEl.innerText = 'Создать';
        this.btnAddEl.addEventListener('click', this.addCategory.bind(this));
    }
    async addCategory() {
        const data = ValidateUtility.serializeForm(this.formEls);
        if (!data) return;
        await request('/categories/' + this.category, 'POST', true, data);
        this.openRoute('/' + this.category);
    }
}