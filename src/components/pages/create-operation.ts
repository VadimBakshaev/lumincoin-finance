import { RequestDataOperationType } from "../../types/request-data.type";
import { RequestResultCategoryType, RequestResultErrorType, RequestResultOperationType, RequestResultType } from "../../types/request-result.type";
import request from "../../utilities/http-utility";
import { ValidateUtility } from "../../utilities/validate-utility";
import { Layout } from "../layout";

export class CreateOperation {
    protected openRoute: (url: string) => Promise<void>;
    protected type: string;
    protected titleEl: HTMLElement | null;
    protected actionBtnEl: HTMLElement | null;
    protected selectCategoryEl: HTMLElement | null;
    protected selectTypeEl: HTMLSelectElement | null;
    protected formEls: NodeListOf<HTMLInputElement>;
    protected categories: RequestResultCategoryType[] | null;

    constructor(openRoute: (url: string) => Promise<void>, type: string) {
        this.openRoute = openRoute;
        this.type = type;
        this.titleEl = document.getElementById('titlePage');
        this.actionBtnEl = document.getElementById('actionBtn');
        this.formEls = document.querySelectorAll('.form-control');
        this.selectCategoryEl = document.getElementById('category_id');
        this.selectTypeEl = document.getElementById('type') as HTMLSelectElement;
        this.categories = null;
    }

    public async init(): Promise<void> {
        if (this.titleEl && this.actionBtnEl) {
            if (this.type === 'income') {
                this.titleEl.innerText = 'Создание дохода';
            }
            if (this.type === 'expense') {
                this.titleEl.innerText = 'Создание расхода';
            }
            this.actionBtnEl.innerText = 'Создать';
            this.actionBtnEl.addEventListener('click', this.sendData.bind(this));
        }
        document.querySelector('.form-container')?.addEventListener('submit', this.sendData.bind(this));
        await this.getCategories();
        this.setSelect();
    }

    private setSelect(): void {
        if (this.selectTypeEl) {
            [...(this.selectTypeEl.options as HTMLOptionsCollection)].find((item: HTMLOptionElement) => item.value === this.type)!.selected = true;
        }

        this.categories && this.categories.forEach((item: RequestResultCategoryType) => {
            if (this.selectCategoryEl && item)
                this.selectCategoryEl.insertAdjacentHTML('beforeend', `<option value="${item.id}">${item.title}</option>`)
        });
    }

    protected async getCategories(): Promise<void> {
        const response: RequestResultType<RequestResultCategoryType[] | RequestResultErrorType> | null = await request('/categories/' + this.type);
        if (response && response.status === 200) {
            this.categories = response.response as RequestResultCategoryType[];
        }
    }

    private async sendData(e: Event): Promise<void> {
        e.preventDefault();
        const data: RequestDataOperationType = ValidateUtility.serializeForm(this.formEls);
        if (data) {
            const response: RequestResultType<RequestResultOperationType | RequestResultErrorType> | null = await request('/operations', 'POST', true, data);
            if (response && response.status === 200) {
                new Layout().getBalance();
                this.openRoute('/operations');
            }
        }
    }
}