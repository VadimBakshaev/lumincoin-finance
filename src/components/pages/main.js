import { Chart } from "chart.js/auto";

export class Main {
  constructor() {
    this.chartIncomeEl = document.getElementById("chart-income");
    this.chartExpensesEl = document.getElementById("chart-expenses");
    // формирование данных для диаграмм
    this.incomeData = {
      labels: ["Red", "Orange", "Yellow", "Green", "Blue"],
      datasets: [
        {
          label: "Доход",
          backgroundColor: ["Red", "Orange", "Yellow", "Green", "Blue"],
          data: [100, 200, 300, 400, 500],
        },
      ],
    };
    this.expensesData = {
      labels: ["Red", "Orange", "Yellow", "Green", "Blue"],
      datasets: [
        {
          label: "Расход",
          backgroundColor: ["Red", "Orange", "Yellow", "Green", "Blue"],
          data: [300, 1100, 200, 600, 100],
        },
      ],
    };
    // вывод диаграмм
    this.chartShow(this.chartIncomeEl,this.incomeData);
    this.chartShow(this.chartExpensesEl,this.expensesData);
  }
  // функция вывода даграммы
  chartShow(el,data) {
    new Chart(el, {
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
