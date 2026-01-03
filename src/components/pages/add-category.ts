import { RequestDataCategoryType } from "../../types/request-data.type";
import request from "../../utilities/http-utility";
import { ValidateUtility } from "../../utilities/validate-utility";
import { Category } from "./category";

export class AddCategory extends Category {
    protected titleEl: HTMLElement | null;
    protected btnActionEl: HTMLAnchorElement | null;
    protected btnCancelEl: HTMLAnchorElement | null;
    protected formEls: NodeListOf<HTMLInputElement>;

    constructor(openRoute: (url: string) => Promise<void>, type: string) {
        super(openRoute, type)
        this.titleEl = document.getElementById('titlePage');
        this.btnActionEl = document.getElementById('btnAction') as HTMLAnchorElement;
        this.btnCancelEl = document.getElementById('btnCancel') as HTMLAnchorElement;
        this.formEls = document.querySelectorAll('.form-control');
    }

    public init(): void {
        if (this.titleEl && this.btnCancelEl && this.btnActionEl) {
            if (this.type === 'income') {
                this.titleEl.innerText = 'Создание категории доходов';
                this.btnCancelEl.href = '/income';
            }
            if (this.type === 'expense') {
                this.titleEl.innerText = 'Создание категории расходов';
                this.btnCancelEl.href = '/expense';
            }
            this.btnActionEl.innerText = 'Создать';
            const formContainerEl: Element | null = document.querySelector('.form-container');
            formContainerEl && formContainerEl.addEventListener('submit', this.addCategory.bind(this));
            this.btnActionEl.addEventListener('click', this.addCategory.bind(this));
        }
    }

    private async addCategory(e: Event): Promise<void> {
        e.preventDefault();
        const data: RequestDataCategoryType = ValidateUtility.serializeForm(this.formEls);
        if (!data) return;
        await request('/categories/' + this.type, 'POST', true, data);
        this.openRoute('/' + this.type);
    }
}