import request from "../../utilities/http-utility";
import { ValidateUtility } from "../../utilities/validate-utility";
import { AddCategory } from "./add-category";

export class EditCategory extends AddCategory {
    constructor(openRoute, type) {
        super(openRoute, type)
        this.id = new URL(location.href).searchParams.get('id');
    }
    init() {
        if (this.type === 'income') {
            this.titleEl.innerText = 'Редактирование категории доходов';
            this.btnCancelEl.href = '/income';
        }
        if (this.type === 'expense') {
            this.titleEl.innerText = 'Редактирование категории расходов';
            this.btnCancelEl.href = '/expense';
        }
        this.btnActionEl.innerText = 'Сохранить';
        document.querySelector('.form-container').addEventListener('submit',this.editCategory.bind(this));
        this.btnActionEl.addEventListener('click', this.editCategory.bind(this));
        this.getData();
    }
    async getData() {
        const data = await request('/categories/' + this.type + '/' + this.id);
        if (data && data.status === 200) {
            this.formEls[0].value = data.response.title;
            this.title = data.response.title;
        }
    }
    async editCategory(e) {
        e.preventDefault();
        const data = ValidateUtility.serializeForm(this.formEls);
        if (!data || data.title === this.title) return;
        await request('/categories/' + this.type + '/' + this.id, 'PUT', true, data);
        this.openRoute('/' + this.type);
    }
}