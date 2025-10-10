import { Chart } from "chart.js/auto";
import { Filter } from "../filter";

export class Main extends Filter {
  constructor(openRoute) {
    super(openRoute);

    this.initChart();
  }
  initChart() {
    this.titlePageEl.innerText = 'Главная';
    this.filterBoxEl.insertAdjacentHTML('beforeend', this.createChartBox());
    this.chartIncomeEl = document.getElementById("chart-income");
    this.chartExpensesEl = document.getElementById("chart-expenses");
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
    this.incomeChart = this.chartShow(this.chartIncomeEl, this.incomeData);
    this.expensesChart = this.chartShow(this.chartExpensesEl, this.expensesData);
    this.setEmitter(this.setData.bind(this));      
  }
  setData() {
    this.clearChart(this.incomeChart);
    this.clearChart(this.expensesChart);    
    if (this.data && this.data.length > 0) {
      this.data.filter(item => item.type === 'income').forEach((item) => {
        const thereIsIndex = this.incomeChart.data.labels.findIndex(category => category === item.category);
        if (thereIsIndex >= 0) {
          this.incomeChart.data.datasets[0].data[thereIsIndex] += item.amount;
        } else {
          this.incomeChart.data.labels.push(item.category);
          this.incomeChart.data.datasets[0].backgroundColor.push(this.getColor());
          this.incomeChart.data.datasets[0].data.push(item.amount);
        }
      });
      this.data.filter(item => item.type === 'expense').forEach(item => {
        const thereIsIndex = this.expensesChart.data.labels.findIndex(category => category === item.category);
        if (thereIsIndex >= 0) {
          this.expensesChart.data.datasets[0].data[thereIsIndex] += item.amount;
        } else {
          this.expensesChart.data.labels.push(item.category);
          this.expensesChart.data.datasets[0].backgroundColor.push(this.getColor());
          this.expensesChart.data.datasets[0].data.push(item.amount);
        }
      });
    }
    this.incomeChart.update();
    this.expensesChart.update();
  }
  clearChart(chart){
    chart.data.labels.splice(0, chart.data.labels.length);
    chart.data.datasets[0].backgroundColor.splice(0, chart.data.datasets[0].backgroundColor.length);
    chart.data.datasets[0].data.splice(0, chart.data.datasets[0].data.length);
  }
  getColor() {
    return '#' + ('000000' + Math.floor(Math.random() * 10000000 + 1).toString(16)).slice(-6);
  }
  createChartBox() {
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
  chartShow(el, data) {
    return new Chart(el, {
      type: "pie",
      data: data,
      options: {
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: true,
          text: "income/expenses",
        },
      },
    });
  }
}
