import { RequestResultCategoryType, RequestResultErrorType, RequestResultType } from "../../types/request-result.type";
import request from "../../utilities/http-utility";

export class Category {
    protected openRoute: (url: string) => Promise<void>;
    protected type: string;
    private categoryTitleEl: HTMLElement | null;
    private categoryBoxEl: HTMLElement | null;
    private deleteBtnEl: HTMLElement | null;

    constructor(openRoute: (url: string) => Promise<void>, type: string) {
        this.openRoute = openRoute;
        this.type = type;
        this.categoryTitleEl = document.getElementById('categoryTitle');
        this.categoryBoxEl = document.getElementById('categoryBox');
        this.deleteBtnEl = document.getElementById('deleteBtn');
    }

    public async getData(): Promise<void> {
        const modalContentEl: HTMLElement | null = document.getElementById('modalContent');
        if (this.type === 'income' && modalContentEl) {
            this.categoryTitleEl && (this.categoryTitleEl.innerText = 'Доходы');
            modalContentEl.innerText = 'Вы действительно хотите удалить категорию? Связанные доходы останутся без категории.';
        };
        if (this.type === 'expense' && modalContentEl) {
            this.categoryTitleEl && (this.categoryTitleEl.innerText = 'Расходы');
            modalContentEl.innerText = 'Вы действительно хотите удалить категорию?';
        }
        const data: RequestResultType<RequestResultCategoryType[] | RequestResultErrorType> | null = await request('/categories/' + this.type);
        const addItemEl: HTMLAnchorElement | null = document.getElementById('addItem') as HTMLAnchorElement;
        addItemEl && (addItemEl.href = '/add-category-' + this.type);
        this.showCard(data);
    }

    private showCard(data: RequestResultType<RequestResultCategoryType[] | RequestResultErrorType> | null): void {
        if (data && data.status === 200) {
            this.categoryBoxEl &&
                this.categoryBoxEl
                    .insertAdjacentHTML('afterbegin', (data.response as RequestResultCategoryType[])
                        .map((item: RequestResultCategoryType) => {
                            return this.createCard(item.id, item.title)
                        }).join(''));
            this.setListener();
        }
    }

    private createCard(id: number, title: string): string {
        return `<div class="p-3 p-md-3_5 text-medium border rounded" id="${id}">
                  <h3 class="fs-3 ">${title}</h3>
                  <a class="btn btn-primary fs-7 edit-btn" href="/edit-category-${this.type}?id=${id}">Редактировать</a>
                  <a class="btn btn-danger fs-7 del-btn" data-bs-toggle="modal" data-bs-target="#modalDialog">Удалить</a>
                </div>`
    }

    private setListener(): void {
        document.querySelectorAll('.del-btn').forEach((elem: Element) => elem.addEventListener('click', (e: Event) => {
            if (this.deleteBtnEl) {
                this.deleteBtnEl.onclick = async () => {
                    if (e && e.target instanceof HTMLElement && e.target.parentNode) {
                        await request('/categories/' + this.type + '/' + (e.target.parentNode as HTMLElement).id, 'DELETE');
                        this.openRoute('/' + this.type);
                    }
                }
            }
        }));
    }
}