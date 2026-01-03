import Chart from "chart.js/auto";
import { Filter } from "../filter";
import { ChartDataType } from "../../types/chart-data.type";
import { RequestResultOperationType } from "../../types/request-result.type";

export class Main extends Filter {
  private chartIncomeEl: HTMLCanvasElement | null;
  private chartExpensesEl: HTMLCanvasElement | null;
  private incomeData: ChartDataType;
  private expensesData: ChartDataType;
  private incomeChart: Chart<"pie", number[], string>;
  private expensesChart: Chart<"pie", number[], string>;

  constructor(openRoute: (url: string) => Promise<void>) {
    super(openRoute);
    this.chartIncomeEl = null;
    this.chartExpensesEl = null;
    this.incomeData = {
      labels: [],
      datasets: [
        {
          label: "Доход",
          backgroundColor: [],
          data: [],
        },
      ],
    };
    this.expensesData = {
      labels: [],
      datasets: [
        {
          label: "Расход",
          backgroundColor: [],
          data: [],
        },
      ],
    };
    this.incomeChart = {} as Chart<"pie", number[], string>;
    this.expensesChart = {} as Chart<"pie", number[], string>;
    this.initChart();
  }

  private initChart(): void {
    if (this.titlePageEl && this.filterBoxEl) {
      this.titlePageEl.innerText = 'Главная';
      this.filterBoxEl.insertAdjacentHTML('beforeend', this.createChartBox());
    }
    this.chartIncomeEl = document.getElementById("chart-income") as HTMLCanvasElement;
    this.chartExpensesEl = document.getElementById("chart-expenses") as HTMLCanvasElement;

    this.incomeChart = this.chartShow(this.chartIncomeEl, this.incomeData);
    this.expensesChart = this.chartShow(this.chartExpensesEl, this.expensesData);
    this.setEmitter(this.setData.bind(this));
  }

  private setData(): void {
    this.clearChart(this.incomeChart);
    this.clearChart(this.expensesChart);
    if (this.data && this.data.length > 0) {
      this.data.filter((item: RequestResultOperationType) => !item.category).forEach((item: RequestResultOperationType) => {
        if (item) item.category = 'Без категории';
      });
      this.data.filter((item: RequestResultOperationType) => item && item.type === 'income').forEach((item: RequestResultOperationType) => {
        const incomeChartData: ChartDataType = this.incomeChart.data as ChartDataType;
        const thereIsIndex = incomeChartData.labels.findIndex((category: string) => category === item?.category);
        if (item && item.amount && item.category) {
          if (thereIsIndex >= 0 && incomeChartData.datasets[0]?.data[thereIsIndex]) {
            incomeChartData.datasets[0].data[thereIsIndex] += item.amount;
          } else {
            incomeChartData.labels.push(item.category);
            incomeChartData.datasets[0]?.backgroundColor.push(this.getColor());
            incomeChartData.datasets[0]?.data.push(item.amount);
          }
        }
      });
      this.data.filter((item: RequestResultOperationType) => item && item.type === 'expense').forEach((item: RequestResultOperationType) => {
        const expensesChartData: ChartDataType = this.expensesChart.data as ChartDataType;
        const thereIsIndex = expensesChartData.labels.findIndex((category: string) => category === item?.category);
        if (item && item.amount && item.category) {
          if (thereIsIndex >= 0 && expensesChartData.datasets[0]?.data[thereIsIndex]) {
            expensesChartData.datasets[0].data[thereIsIndex] += item.amount;
          } else {
            expensesChartData.labels.push(item.category);
            expensesChartData.datasets[0]?.backgroundColor.push(this.getColor());
            expensesChartData.datasets[0]?.data.push(item.amount);
          }
        }
      });
    }
    this.incomeChart.update();
    this.expensesChart.update();
  }

  private clearChart(chart: Chart<"pie", number[], string>): void {
    const chartData: ChartDataType = chart.data as ChartDataType;
    chartData.labels.splice(0, chartData.labels.length);
    chartData.datasets[0]?.backgroundColor.splice(0, chartData.datasets[0].backgroundColor.length);
    chartData.datasets[0]?.data.splice(0, chartData.datasets[0].data.length);
  }

  private getColor(): string {
    return '#' + ('000000' + Math.floor(Math.random() * 100000000 + 1).toString(16)).slice(-6);
  }

  private createChartBox(): string {
    return `<div class="d-flex flex-wrap gap-1">
        <div class="col-12 col-lg-5">
            <h3 class="text-medium text-center fs-3">Доходы</h3>
            <div>
                <canvas id="chart-income"></canvas>
            </div>
        </div>
        <div class="d-none bg-dark-subtle d-lg-block separator"></div>
        <div class="col-12 col-lg-5">
            <h3 class="text-medium text-center fs-3">Расходы</h3>
            <div>
                <canvas id="chart-expenses"></canvas>
            </div>
        </div>
    </div>`
  }

  private chartShow(el: HTMLCanvasElement, data: ChartDataType): Chart<"pie", number[], string> {
    return new Chart(el, {
      type: "pie",
      data: data,
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          title: {
            display: false,
            text: "income/expenses",
          },
        },
      },
    });
  }
}
