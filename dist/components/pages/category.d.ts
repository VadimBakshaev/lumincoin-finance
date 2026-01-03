export declare class Category {
    protected openRoute: (url: string) => Promise<void>;
    protected type: string;
    private categoryTitleEl;
    private categoryBoxEl;
    private deleteBtnEl;
    constructor(openRoute: (url: string) => Promise<void>, type: string);
    getData(): Promise<void>;
    private showCard;
    private createCard;
    private setListener;
}
//# sourceMappingURL=category.d.ts.map