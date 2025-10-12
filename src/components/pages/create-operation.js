import request from "../../utilities/http-utility";
import { ValidateUtility } from "../../utilities/validate-utility";
import { Layout } from "../layout";

export class CreateOperation {
    constructor(openRoute, type) {
        this.openRoute = openRoute;
        this.type = type;
        this.titleEl = document.getElementById('titlePage');
        this.actionBtnEl = document.getElementById('actionBtn');
        this.formEls = document.querySelectorAll('.form-control');
        this.selectCategoryEl = document.getElementById('category_id');
        this.selectTypeEl = document.getElementById('type');
        this.categories = null;        
    }
    async init() {
        if (this.type === 'income') {
            this.titleEl.innerText = 'Создание дохода';
        }
        if (this.type === 'expense') {
            this.titleEl.innerText = 'Создание расхода';
        }
        this.actionBtnEl.innerText = 'Создать';
        this.actionBtnEl.addEventListener('click', this.sendData.bind(this));
        document.querySelector('.form-container').addEventListener('submit',this.sendData.bind(this));
        await this.getCategories();
        this.setSelect();
    }
    setSelect() {
        [...this.selectTypeEl.options].find(item => item.value === this.type).selected = true;
        this.categories.forEach(item => {
            this.selectCategoryEl.insertAdjacentHTML('beforeend', `<option value="${item.id}">${item.title}</option>`)
        });
    }
    async getCategories() {
        const response = await request('/categories/' + this.type);
        if (response && response.status === 200) {
            this.categories = response.response;
        }
    }
    async sendData(e) {
        e.preventDefault();
        const data = ValidateUtility.serializeForm(this.formEls);
        if (data) {
            const response = await request('/operations', 'POST', true, data);
            if (response && response.status === 200) {
                new Layout().getBalance();
                this.openRoute('/operations');
            }
        }
    }
}