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
import { RoutesType } from "../types/routes.type";

export class Router {
  private pageTitleEl: HTMLElement | null;
  private contentEl: HTMLElement | null;
  private openRoute: (url: string) => Promise<void>;
  private routes: RoutesType[];
  private layout: Layout | null;
  private mainContentEl: HTMLElement | null;

  constructor() {
    this.pageTitleEl = document.getElementById("title");
    this.contentEl = document.getElementById("content");
    this.mainContentEl = null;
    this.openRoute = async (url) => {
      const currentRoute: string = location.pathname;
      history.pushState({}, "", url);
      await this.activateRoute(null, currentRoute);
    };
    this.layout = null;
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
        layout: null,
        depends: null,
        load: () => {
          new Login(this.openRoute);
        },
      },
      {
        route: "/signup",
        title: "Sign Up",
        filePath: "/templates/pages/signup.html",
        layout: null,
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
        title: '',
        filePath: '',
        layout: null,
        depends: null,
        load: () => {
          new Logout(this.openRoute);
        },
      },
    ];
    this.init();
  }

  private init(): void {
    window.addEventListener("DOMContentLoaded", this.activateRoute.bind(this));
    window.addEventListener("popstate", this.activateRoute.bind(this));
    document.addEventListener("click", this.clickHandler.bind(this));
    }

  private async clickHandler(e: MouseEvent): Promise<void> {
    const target = e.target as Element | null;
    let element: HTMLAnchorElement | null = null;
    if (target instanceof HTMLElement && target.closest("A")) {
      element = target.closest("A") as HTMLAnchorElement;
    }
    if (element && element.hasAttribute('href')) {
      e.preventDefault();
      const param: string = new URL(element.href).search;
      const url: string = new URL(element.href).pathname;

      if (!url || url.replace("#", "") === location.pathname) {
        return;
      }
      await this.openRoute(url + param);
    }
  }

  private async activateRoute(e?: any, oldRoute: string | null = null): Promise<void> {
    let prevPage: RoutesType | undefined = undefined;
    if (oldRoute) {
      prevPage = this.routes.find((item) => oldRoute === item.route);
    }
    const urlRoute: string = window.location.pathname;
    const newRoute: RoutesType | undefined = this.routes.find((item) => urlRoute === item.route);
    if (newRoute && this.contentEl) {
      if (this.pageTitleEl) {
        this.pageTitleEl.innerText = newRoute.title;
      };
      if (newRoute.layout) {
        if (!AuthUtility.checkAuthorization()) {
          this.openRoute('/logout');
          return;
        };
        if (prevPage && prevPage.layout) {
          if (!this.mainContentEl) return;
          await this.constructTemplate(
            this.mainContentEl,
            newRoute.filePath
          );
          if (newRoute.depends) {
            this.layout?.setActive(newRoute.depends);
          } else {
            this.layout?.setActive(newRoute.route);
          }
        } else {
          await this.constructTemplate(this.contentEl, newRoute.layout);
          this.mainContentEl = document.getElementById("main-content");
          if (!this.mainContentEl) return;
          await this.constructTemplate(
            this.mainContentEl,
            newRoute.filePath
          );
          this.layout = new Layout(this.openRoute);
          this.layout.setActive(newRoute.route);
        }
      } else {
        await this.constructTemplate(this.contentEl, newRoute.filePath);
      }
      newRoute.load();
    } else {
      history.pushState({}, "", "/");
      await this.activateRoute();
    }
  }

  private async constructTemplate(element: HTMLElement, template: string): Promise<void> {
    element.innerHTML = await fetch(template).then((response: Response) =>
      response.text()
    );
  }
}
