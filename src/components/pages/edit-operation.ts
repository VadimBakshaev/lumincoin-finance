import { RequestDataOperationType } from "../../types/request-data.type";
import { RequestResultCategoryType, RequestResultErrorType, RequestResultOperationType, RequestResultType } from "../../types/request-result.type";
import request from "../../utilities/http-utility";
import { ValidateUtility } from "../../utilities/validate-utility";
import { Layout } from "../layout";
import { CreateOperation } from "./create-operation";

export class EditOperation extends CreateOperation {
    private id: string | null;
    private data: RequestResultOperationType | null;

    constructor(openRoute: (url: string) => Promise<void>, type: string) {
        super(openRoute, type)
        this.id = new URL(location.href).searchParams.get('id');
        this.data = null;
    }

    public async init(): Promise<void> {
        if (this.titleEl && this.actionBtnEl && this.selectTypeEl) {
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
            document.querySelector('.form-container')?.addEventListener('submit', this.saveData.bind(this));
            this.actionBtnEl.addEventListener('click', this.saveData.bind(this));
        }
    }

    private setData(): void {
        for (let key in this.data) {
            const currentKey: HTMLInputElement | undefined = [...this.formEls].find((element: HTMLInputElement) => element.id === key);
            if (currentKey) {
                currentKey.value = this.data[key as keyof RequestResultOperationType] as string;
            }
            if (key === 'category') {
                this.categories && this.categories.forEach((item: RequestResultCategoryType) => {
                    if (item && this.selectCategoryEl && this.data) {
                        if (item.title === this.data[key as keyof RequestResultOperationType]) {
                            this.selectCategoryEl.insertAdjacentHTML('beforeend', `<option value="${item.id}" selected>${item.title}</option>`);
                        } else {
                            this.selectCategoryEl.insertAdjacentHTML('beforeend', `<option value="${item.id}">${item.title}</option>`);
                        }
                    }
                });
            }
        }
    }
    
    private async getData(): Promise<void> {
        const response: RequestResultType<RequestResultOperationType | RequestResultErrorType> | null = await request('/operations/' + this.id);
        if (response && response.status === 200) {
            this.data = response.response as RequestResultOperationType;
            this.setData();
        }
    }

    private async saveData(e: Event): Promise<void> {
        e.preventDefault();
        const data: RequestDataOperationType = ValidateUtility.serializeForm(this.formEls);
        if (data && this.compareData(data)) {
            const response: RequestResultType<RequestResultOperationType | RequestResultErrorType> | null = await request('/operations/' + this.id, 'PUT', true, data);
            if (response && response.status === 200) {
                new Layout().getBalance();
                this.openRoute('/operations')
            }
        }
    }

    private compareData(data: RequestDataOperationType): boolean {
        for (let key in data) {
            if (this.data && this.categories) {
                if (data[key as keyof RequestDataOperationType] !== this.data[key as keyof RequestResultOperationType]) return true;
                if (key === 'category_id' &&
                    this.categories.find((item: RequestResultCategoryType) => item.id === data[key as keyof RequestDataOperationType])?.title !== this.data.category) return true;
            }
        }
        return false;
    }
}