import { Category } from "./category";
export declare class AddCategory extends Category {
    protected titleEl: HTMLElement | null;
    protected btnActionEl: HTMLAnchorElement | null;
    protected btnCancelEl: HTMLAnchorElement | null;
    protected formEls: NodeListOf<HTMLInputElement>;
    constructor(openRoute: (url: string) => Promise<void>, type: string);
    init(): void;
    private addCategory;
}
//# sourceMappingURL=add-category.d.ts.map