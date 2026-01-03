import { CreateOperation } from "./create-operation";
export declare class EditOperation extends CreateOperation {
    private id;
    private data;
    constructor(openRoute: (url: string) => Promise<void>, type: string);
    init(): Promise<void>;
    private setData;
    private getData;
    private saveData;
    private compareData;
}
//# sourceMappingURL=edit-operation.d.ts.map