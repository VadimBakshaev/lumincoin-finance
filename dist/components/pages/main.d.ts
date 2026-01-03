import { Filter } from "../filter";
export declare class Main extends Filter {
    private chartIncomeEl;
    private chartExpensesEl;
    private incomeData;
    private expensesData;
    private incomeChart;
    private expensesChart;
    constructor(openRoute: (url: string) => Promise<void>);
    private initChart;
    private setData;
    private clearChart;
    private getColor;
    private createChartBox;
    private chartShow;
}
//# sourceMappingURL=main.d.ts.map