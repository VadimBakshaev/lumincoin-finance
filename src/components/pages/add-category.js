import request from "../../utilities/http-utility";
import { ValidateUtility } from "../../utilities/validate-utility";
import { Category } from "./category";

export class AddCategory extends Category {
    constructor(openRoute, type) {
        super(openRoute, type)
        this.titleEl = document.getElementById('titlePage');
        this.btnActionEl = document.getElementById('btnAction');
        this.btnCancelEl = document.getElementById('btnCancel');
        this.formEls = document.querySelectorAll('.form-control');
    }
    init() {
        if (this.type === 'income') {
            this.titleEl.innerText = 'Создание категории доходов';
            this.btnCancelEl.href = '/income';
        }
        if (this.type === 'expense') {
            this.titleEl.innerText = 'Создание категории расходов';
            this.btnCancelEl.href = '/expense';
        }
        this.btnActionEl.innerText = 'Создать';
        document.querySelector('.form-container').addEventListener('submit',this.addCategory.bind(this));
        this.btnActionEl.addEventListener('click', this.addCategory.bind(this));
    }
    async addCategory(e) {
        e.preventDefault();
        const data = ValidateUtility.serializeForm(this.formEls);
        if (!data) return;
        await request('/categories/' + this.type, 'POST', true, data);
        this.openRoute('/' + this.type);
    }
}