import { Layout } from "../components/layout";
import { AddCategoryExpenses } from "../components/pages/add-category-expenses";
import { AddCategoryIncome } from "../components/pages/add-category-income";
import { CreateExpense } from "../components/pages/create-expense";
import { CreateIncome } from "../components/pages/create-income";
import { EditCategoryExpenses } from "../components/pages/edit-category-expenses";
import { EditCategoryIncome } from "../components/pages/edit-category-income";
import { EditExpense } from "../components/pages/edit-expense";
import { EditIncome } from "../components/pages/edit-income";
import { Expenses } from "../components/pages/expenses";
import { IncExp } from "../components/pages/inc-exp";
import { Income } from "../components/pages/income";
import { Login } from "../components/pages/login";
import { Main } from "../components/pages/main";
import { Signup } from "../components/pages/signup";

export class Router {
  constructor() {
    this.pageTitleEl = document.getElementById("title");
    this.contentEl = document.getElementById("content");
    this.openRoute = async (url) => {
      const currentRoute = location.pathname;
      history.pushState({}, "", url);
      await this.activateRoute(null, currentRoute);
    };
    this.routes = [
      {
        route: "/",
        title: "Main",
        filePath: "/templates/pages/main.html",
        layout: "/templates/layout.html",
        depends: null,
        load: () => {
          new Main();
        },
      },
      {
        route: "/login",
        title: "Login",
        filePath: "/templates/pages/login.html",
        layout: false,
        depends: null,
        load: () => {
          new Login();
        },
      },
      {
        route: "/signup",
        title: "Sign Up",
        filePath: "/templates/pages/signup.html",
        layout: false,
        depends: null,
        load: () => {
          new Signup();
        },
      },
      {
        route: "/inc-exp",
        title: "Income & Expenses",
        filePath: "/templates/pages/inc-exp.html",
        layout: "/templates/layout.html",
        depends: null,
        load: () => {
          new IncExp();
        },
      },
      {
        route: "/income",
        title: "Income",
        filePath: "/templates/pages/income.html",
        layout: "/templates/layout.html",
        depends: null,
        load: () => {
          new Income();
        },
      },
      {
        route: "/add-category-income",
        title: "Add Category Income",
        filePath: "/templates/pages/add-category-income.html",
        layout: "/templates/layout.html",
        depends: "/income",
        load: () => {
          new AddCategoryIncome();
        },
      },
      {
        route: "/edit-category-income",
        title: "Edit Category Income",
        filePath: "/templates/pages/edit-category-income.html",
        layout: "/templates/layout.html",
        depends: "/income",
        load: () => {
          new EditCategoryIncome();
        },
      },
      {
        route: "/expenses",
        title: "Expenses",
        filePath: "/templates/pages/expenses.html",
        layout: "/templates/layout.html",
        depends: null,
        load: () => {
          new Expenses();
        },
      },
      {
        route: "/add-category-expenses",
        title: "Add Category Expenses",
        filePath: "/templates/pages/add-category-expenses.html",
        layout: "/templates/layout.html",
        depends: "/expenses",
        load: () => {
          new AddCategoryExpenses();
        },
      },
      {
        route: "/edit-category-expenses",
        title: "Edit Category Expenses",
        filePath: "/templates/pages/edit-category-expenses.html",
        layout: "/templates/layout.html",
        depends: "/expenses",
        load: () => {
          new EditCategoryExpenses();
        },
      },
      {
        route: "/create-expense",
        title: "Create Expense",
        filePath: "/templates/pages/create-expense.html",
        layout: "/templates/layout.html",
        depends: "/inc-exp",
        load: () => {
          new CreateExpense();
        },
      },
      {
        route: "/create-income",
        title: "Create Income",
        filePath: "/templates/pages/create-income.html",
        layout: "/templates/layout.html",
        depends: "/inc-exp",
        load: () => {
          new CreateIncome();
        },
      },
      {
        route: "/edit-income",
        title: "Edit Income",
        filePath: "/templates/pages/edit-income.html",
        layout: "/templates/layout.html",
        depends: "/inc-exp",
        load: () => {
          new EditIncome();
        },
      },
      {
        route: "/edit-expense",
        title: "Edit Expense",
        filePath: "/templates/pages/edit-expense.html",
        layout: "/templates/layout.html",
        depends: "/inc-exp",
        load: () => {
          new EditExpense();
        },
      },
    ];
    this.init();
  }

  init() {
    window.addEventListener("DOMContentLoaded", this.activateRoute.bind(this));
    window.addEventListener("popstate", this.activateRoute.bind(this));
    document.addEventListener("click", this.clickHandler.bind(this));
  }

  async clickHandler(e) {
    let element = null;
    if (e.target.nodeName === "A") {
      element = e.target;
    } else if (e.target.parentNode.nodeName === "A") {
      element = e.target.parentNode;
    }
    if (element && element.href) {
      e.preventDefault();
      const url = new URL(element.href).pathname;

      if (!url || url.replace("#", "") === location.pathname) {
        return;
      }
      await this.openRoute(url);
    }
  }

  async activateRoute(e, oldRoute = null) {
    let prevPage = null;
    if (oldRoute) {
      prevPage = this.routes.find((item) => oldRoute === item.route);
    }
    const urlRoute = window.location.pathname;
    const newRoute = this.routes.find((item) => urlRoute === item.route);
    if (newRoute) {
      this.pageTitleEl.innerText = newRoute.title;
      if (newRoute.layout) {
        if (prevPage && prevPage.layout) {
          await this.#constructTemplate(
            document.getElementById("main-content"),
            newRoute.filePath
          );
          if (newRoute.depends) {
            this.layout.setActive(newRoute.depends);
          } else {
            this.layout.setActive(newRoute.route);
          }
        } else {
          await this.#constructTemplate(this.contentEl, newRoute.layout);
          await this.#constructTemplate(
            document.getElementById("main-content"),
            newRoute.filePath
          );
          this.layout = new Layout();
          this.layout.setActive(newRoute.route);
        }
      } else {
        await this.#constructTemplate(this.contentEl, newRoute.filePath);
      }
      newRoute.load();
    } else {
      history.pushState({}, "", "/");
      await this.activateRoute();
    }
  }

  async #constructTemplate(element, template) {
    element.innerHTML = await fetch(template).then((response) =>
      response.text()
    );
  }
}
