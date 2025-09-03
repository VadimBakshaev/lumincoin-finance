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
    // функция переходя на другие страницы
    this.openRoute = async (url) => {
      // сохраняем предыдущий роут
      const currentRoute = location.pathname;
      // меняем адрес
      history.pushState({}, "", url);
      // вызываем функцию обработки текущего адреса, и передаем предыдущий
      await this.activateRoute(null, currentRoute);
    };
    // массив объектов с настройками страниц
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

  // функция установки глобальных обработчиков событий: загрузки, перехода и клика
  init() {
    window.addEventListener("DOMContentLoaded", this.activateRoute.bind(this));
    window.addEventListener("popstate", this.activateRoute.bind(this));
    document.addEventListener("click", this.clickHandler.bind(this));
  }

  // функция обработчик события клика
  async clickHandler(e) {
    let element = null;
    // если клик по ссылке, сохраняем элемент в переменную
    if (e.target.nodeName === "A") {
      element = e.target;
    } else if (e.target.parentNode.nodeName === "A") {
      element = e.target.parentNode;
    }
    // если элемент в переменной есть и у него есть атрибут href
    if (element && !element.href) {
      e.preventDefault();
      // берем url из ссылки (какой вариант лучше?)
      //const url = new URL(element.href).pathname;
      const url = element.href.replace(location.origin, "");

      // если адрес пустой или он совпадает с текущим
      if (!url || url.replace("#", "") === location.pathname) {
        return;
      }
      // вызываем функцию перехода на другую страницу
      await this.openRoute(url);
    }
  }

  // функция активации текущей страниы
  async activateRoute(e, oldRoute = null) {
    let prevPage = null;
    // если передана предыдущая страница, находим ее и сохраняем в переменную
    if (oldRoute) {
      prevPage = this.routes.find((item) => oldRoute === item.route);
    }
    // находим в массиве настройки текущей страницы
    const urlRoute = window.location.pathname;
    const newRoute = this.routes.find((item) => urlRoute === item.route);
    // если страница найдена
    if (newRoute) {
      // устанавливаем заголовок
      this.pageTitleEl.innerText = newRoute.title;
      // если применятся лэйаут
      if (newRoute.layout) {
        // и если лэйаут применялся на пердыдущей странице
        if (prevPage && prevPage.layout) {
          // вставляем содержимое страницы в лэйаут
          await this.#constructTemplate(
            document.getElementById("main-content"),
            newRoute.filePath
          );
          // проверяем есть ли зависимости у текущей страницы, и устанавливаем активный пункт меню
          if (newRoute.depends) {
            this.layout.setActive(newRoute.depends);
          } else {
            this.layout.setActive(newRoute.route);
          }
        } else { // если предыдущей страницы нет, или на ней не использовался лэйаут
          // загружаем лэйаут
          await this.#constructTemplate(this.contentEl, newRoute.layout);
          // загружаем содержимое страницы
          await this.#constructTemplate(
            document.getElementById("main-content"),
            newRoute.filePath
          );
          // активируем лэйаут
          this.layout = new Layout();
          // устанавливаем активный пункт меню
          this.layout.setActive(newRoute.route);
        }
      } else { // если лэйаут не используется, загружаем содержимое страницы        
        await this.#constructTemplate(this.contentEl, newRoute.filePath);
      }
      newRoute.load();
    } else { // если страница не найдена, загружаем главную
      history.pushState({}, "", "/");
      await this.activateRoute();
    }
  }

  // функция для вставки элементов страницы. 
  // element - куда; template - что
  async #constructTemplate(element, template) {
    element.innerHTML = await fetch(template).then((response) =>
      response.text()
    );
  }
}
