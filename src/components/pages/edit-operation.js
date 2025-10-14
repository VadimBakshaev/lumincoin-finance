import request from "../../utilities/http-utility";
import { ValidateUtility } from "../../utilities/validate-utility";
import { Layout } from "../layout";
import { CreateOperation } from "./create-operation";

export class EditOperation extends CreateOperation {
    constructor(openRoute, type) {
        super(openRoute, type)
        this.id = new URL(location.href).searchParams.get('id');
    }
    async init() {
        if (this.type === 'income') {
            this.titleEl.innerText = 'Редактирование дохода';
        }
        if (this.type === 'expense') {
            this.titleEl.innerText = 'Редактирование расхода';
        }
        this.actionBtnEl.innerText = 'Сохранить';
        this.selectTypeEl.setAttribute('disabled', 'disabled');
        await this.getCategories();
        await this.getData();
        document.querySelector('.form-container').addEventListener('submit', this.saveData.bind(this));
        this.actionBtnEl.addEventListener('click', this.saveData.bind(this));
    }
    setData() {
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
    async saveData(e) {
        e.preventDefault();
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