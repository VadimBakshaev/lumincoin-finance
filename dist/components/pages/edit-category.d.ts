import { AddCategory } from "./add-category";
export declare class EditCategory extends AddCategory {
    private id;
    private title;
    constructor(openRoute: (url: string) => Promise<void>, type: string);
    init(): void;
    private getCategory;
    private editCategory;
}
//# sourceMappingURL=edit-category.d.ts.map