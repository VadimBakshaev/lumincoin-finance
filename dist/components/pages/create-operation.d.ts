import { RequestResultCategoryType } from "../../types/request-result.type";
export declare class CreateOperation {
    protected openRoute: (url: string) => Promise<void>;
    protected type: string;
    protected titleEl: HTMLElement | null;
    protected actionBtnEl: HTMLElement | null;
    protected selectCategoryEl: HTMLElement | null;
    protected selectTypeEl: HTMLSelectElement | null;
    protected formEls: NodeListOf<HTMLInputElement>;
    protected categories: RequestResultCategoryType[] | null;
    constructor(openRoute: (url: string) => Promise<void>, type: string);
    init(): Promise<void>;
    private setSelect;
    protected getCategories(): Promise<void>;
    private sendData;
}
//# sourceMappingURL=create-operation.d.ts.map