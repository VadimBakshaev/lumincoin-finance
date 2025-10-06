import request from "../../utilities/http-utility";
import { ValidateUtility } from "../../utilities/validate-utility";
import { Layout } from "../layout";

export class EditOperation {
    constructor(openRoute, type) {
        this.openRoute = openRoute;
        this.type = type;
        this.titleEl = document.getElementById('titlePage');
        this.actionBtnEl = document.getElementById('actionBtn');
        this.formEls = document.querySelectorAll('.form-control');
        this.selectCategoryEl = document.getElementById('category_id');
        this.selectTypeEl = document.getElementById('type');
        this.categories = null;
        this.id = new URL(location.href).searchParams.get('id');
        this.init();
    }
    init() {
        if (this.type === 'income') {
            this.titleEl.innerText = 'Редактирование дохода';
        }
        if (this.type === 'expense') {
            this.titleEl.innerText = 'Редактирование расхода';
        }
        this.actionBtnEl.innerText = 'Сохранить';
        this.selectTypeEl.setAttribute('disabled', 'disabled');
        this.getCategories();
        this.getData();
        this.actionBtnEl.addEventListener('click', this.saveData.bind(this));        
    }
    setData() {
        // целесообразно ли здесь использовать цикл с поиском? или проще просто в ручную выставить все значения? в плане оптимизации...
        for (let key in this.data) {
            const currentKey = [...this.formEls].find(element => element.id === key);
            if (currentKey) {
                currentKey.value = this.data[key]
            }
            if (key === 'category') {
                this.categories.forEach(item => {
                    if (item.title === this.data[key]) {
                        this.selectCategoryEl.insertAdjacentHTML('beforeend', `<option value="${item.id}" selected>${item.title}</option>`);
                    } else {
                        this.selectCategoryEl.insertAdjacentHTML('beforeend', `<option value="${item.id}">${item.title}</option>`);
                    }
                });
            }
        }
    }
    async getCategories() {
        const response = await request('/categories/' + this.type);
        if (response && response.status === 200) {
            this.categories = response.response;
        }
    }
    async getData() {
        const response = await request('/operations/' + this.id);
        if (response && response.status === 200) {
            this.data = response.response;
            this.setData();
        }
    }
    async saveData() {
        const data = ValidateUtility.serializeForm(this.formEls);
        if (data && this.compareData(data)) {
            const response = await request('/operations/' + this.id, 'PUT', true, data);
            if (response && response.status === 200) {
                new Layout().getBalance();
                this.openRoute('/operations')
            }
        }

    }
    compareData(data) {
        for (let key in data) {
            if (this.data[key]) {
                if (data[key] !== this.data[key]) return true;
            }
            if (key === 'category_id' &&
                this.categories.find(item => item.id === data[key]).title !== this.data.category) return true;
        }
        return false;
    }
}