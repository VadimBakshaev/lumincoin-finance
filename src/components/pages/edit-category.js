import request from "../../utilities/http-utility";
import { ValidateUtility } from "../../utilities/validate-utility";

export class EditCategory {
    constructor(openRoute, category) {
        this.openRoute = openRoute;
        this.category = category;
        this.titleEl = document.getElementById('titlePage');
        this.btnEditEl = document.getElementById('btnAction');
        this.btnCancelEl = document.getElementById('btnCancel');
        this.formEls = document.querySelectorAll('.form-control');
        this.id = new URL(location.href).searchParams.get('id');
        this.init();
    }
    init() {
        if (this.category === 'income') {
            this.titleEl.innerText = 'Редактирование категории доходов';
            this.btnCancelEl.href = '/income';
        }
        if (this.category === 'expense') {
            this.titleEl.innerText = 'Редактирование категории расходов';
            this.btnCancelEl.href = '/expense';
        }
        this.btnEditEl.innerText = 'Сохранить';
        this.btnEditEl.addEventListener('click', this.editCategory.bind(this));
        this.getData();
    }
    async getData() {
        const data = await request('/categories/' + this.category + '/' + this.id);
        if (data && data.status === 200) {
            this.formEls[0].value = data.response.title;
            this.title = data.response.title;
        }
    }
    async editCategory() {        
        const data = ValidateUtility.serializeForm(this.formEls);
        if (!data || data.title === this.title) return;
        await request('/categories/' + this.category + '/' + this.id, 'PUT', true, data);
        this.openRoute('/' + this.category);
    }
}