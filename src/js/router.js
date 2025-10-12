import { Layout } from "../components/layout";
import { AddCategory } from "../components/pages/add-category";
import { CreateOperation } from "../components/pages/create-operation";
import { EditCategory } from "../components/pages/edit-category";
import { EditOperation } from "../components/pages/edit-operation";
import { Category } from "../components/pages/category";
import { Login } from "../components/pages/login";
import { Logout } from "../components/pages/logout";
import { Main } from "../components/pages/main";
import { Signup } from "../components/pages/signup";
import { AuthUtility } from "../utilities/auth-utility";
import { Operations } from "../components/pages/operations";

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
        filePath: "/templates/pages/filter.html",
        layout: "/templates/layout.html",
        depends: null,
        load: () => {
          new Main(this.openRoute);
        },
      },
      {
        route: "/login",
        title: "Login",
        filePath: "/templates/pages/login.html",
        layout: false,
        depends: null,
        load: () => {
          new Login(this.openRoute);
        },
      },
      {
        route: "/signup",
        title: "Sign Up",
        filePath: "/templates/pages/signup.html",
        layout: false,
        depends: null,
        load: () => {
          new Signup(this.openRoute);
        },
      },
      {
        route: "/operations",
        title: "Income & Expenses",
        filePath: "/templates/pages/filter.html",
        layout: "/templates/layout.html",
        depends: null,
        load: () => {
          new Operations(this.openRoute);
        },
      },
      {
        route: "/income",
        title: "Income",
        filePath: "/templates/pages/categories.html",
        layout: "/templates/layout.html",
        depends: null,
        load: () => {
          const income = new Category(this.openRoute, 'income');
          income.getData();
        },
      },
      {
        route: "/add-category-income",
        title: "Add Category Income",
        filePath: "/templates/pages/action-category.html",
        layout: "/templates/layout.html",
        depends: "/income",
        load: () => {
          const addCategory = new AddCategory(this.openRoute, 'income');
          addCategory.init();
        },
      },
      {
        route: "/edit-category-income",
        title: "Edit Category Income",
        filePath: "/templates/pages/action-category.html",
        layout: "/templates/layout.html",
        depends: "/income",
        load: () => {
          const editCategory = new EditCategory(this.openRoute, 'income');
          editCategory.init();
        },
      },
      {
        route: "/expense",
        title: "Expenses",
        filePath: "/templates/pages/categories.html",
        layout: "/templates/layout.html",
        depends: null,
        load: () => {
          const expense = new Category(this.openRoute, 'expense');
          expense.getData();
        },
      },
      {
        route: "/add-category-expense",
        title: "Add Category Expenses",
        filePath: "/templates/pages/action-category.html",
        layout: "/templates/layout.html",
        depends: "/expense",
        load: () => {
          const addCategory = new AddCategory(this.openRoute, 'expense');
          addCategory.init();
        },
      },
      {
        route: "/edit-category-expense",
        title: "Edit Category Expenses",
        filePath: "/templates/pages/action-category.html",
        layout: "/templates/layout.html",
        depends: "/expense",
        load: () => {
          const editCategory = new EditCategory(this.openRoute, 'expense');
          editCategory.init();
        },
      },
      {
        route: "/create-expense",
        title: "Create Expense",
        filePath: "/templates/pages/action-operation.html",
        layout: "/templates/layout.html",
        depends: "/operations",
        load: () => {
          const createOperation = new CreateOperation(this.openRoute, 'expense');
          createOperation.init();
        },
      },
      {
        route: "/create-income",
        title: "Create Income",
        filePath: "/templates/pages/action-operation.html",
        layout: "/templates/layout.html",
        depends: "/operations",
        load: () => {
          const createOperation = new CreateOperation(this.openRoute, 'income');
          createOperation.init();
        },
      },
      {
        route: "/edit-income",
        title: "Edit Income",
        filePath: "/templates/pages/action-operation.html",
        layout: "/templates/layout.html",
        depends: "/operations",
        load: () => {
          const editOperation = new EditOperation(this.openRoute, 'income');
          editOperation.init();
        },
      },
      {
        route: "/edit-expense",
        title: "Edit Expense",
        filePath: "/templates/pages/action-operation.html",
        layout: "/templates/layout.html",
        depends: "/operations",
        load: () => {
          const editOperation = new EditOperation(this.openRoute, 'expense');
          editOperation.init();
        },
      },
      {
        route: "/logout",
        load: () => {
          new Logout(this.openRoute);
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
      const param = new URL(element.href).search;
      const url = new URL(element.href).pathname;

      if (!url || url.replace("#", "") === location.pathname) {
        return;
      }
      await this.openRoute(url + param);
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
        if (!AuthUtility.checkAuthorization()) {
          this.openRoute('/logout');
          return;
        };
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
          this.layout = new Layout(this.openRoute);
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
