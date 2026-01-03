import { RequestDataCategoryType } from "../../types/request-data.type";
import { RequestResultCategoryType, RequestResultErrorType, RequestResultType } from "../../types/request-result.type";
import request from "../../utilities/http-utility";
import { ValidateUtility } from "../../utilities/validate-utility";
import { AddCategory } from "./add-category";

export class EditCategory extends AddCategory {
    private id: string | null;
    private title: string;

    constructor(openRoute: (url: string) => Promise<void>, type: string) {
        super(openRoute, type);
        this.title = '';
        this.id = new URL(location.href).searchParams.get('id');
    }

    public init(): void {
        if (this.titleEl && this.btnCancelEl && this.btnActionEl) {
            if (this.type === 'income') {
                this.titleEl.innerText = 'Редактирование категории доходов';
                this.btnCancelEl.href = '/income';
            }
            if (this.type === 'expense') {
                this.titleEl.innerText = 'Редактирование категории расходов';
                this.btnCancelEl.href = '/expense';
            }
            this.btnActionEl.innerText = 'Сохранить';
            const formContainerEl: Element | null = document.querySelector('.form-container');
            formContainerEl && formContainerEl.addEventListener('submit', this.editCategory.bind(this));
            this.btnActionEl.addEventListener('click', this.editCategory.bind(this));
            this.getCategory();
        }
    }

    private async getCategory(): Promise<void> {
        const data: RequestResultType<RequestResultCategoryType | RequestResultErrorType> | null = await request('/categories/' + this.type + '/' + this.id);
        if (data && data.status === 200 && this.formEls[0]) {
            this.formEls[0].value = (data.response as RequestResultCategoryType).title;
            this.title = (data.response as RequestResultCategoryType).title;
        }
    }

    private async editCategory(e: Event): Promise<void> {
        e.preventDefault();
        const data: RequestDataCategoryType = ValidateUtility.serializeForm(this.formEls);
        if (!data || data.title === this.title) return;
        await request('/categories/' + this.type + '/' + this.id, 'PUT', true, data);
        this.openRoute('/' + this.type);
    }
}