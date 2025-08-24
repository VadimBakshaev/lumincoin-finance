import { Login } from "../components/pages/login";
import { Main } from "../components/pages/main";
import { Signup } from "../components/pages/signup";

export class Router {
  constructor() {
    window.addEventListener("DOMContentLoaded", this.activateRoute.bind(this));
    window.addEventListener("popstate", this.activateRoute.bind(this));
    this.routes = [
      {
        route: "/",
        title: "Main",
        filePath: "/templates/pages/main.html",
        load: () => {
          new Main();
        },
      },
      {
        route: "/login",
        title: "Login",
        filePath: "/templates/pages/login.html",
        load: () => {
          new Login();
        },
      },
      {
        route: "/signup",
        title: "Sign Up",
        filePath: "/templates/pages/signup.html",
        load: () => {
          new Signup();
        },
      },
    ];
  }
  async activateRoute() {
    const urlRoute = window.location.pathname;
    const newRoute = this.routes.find((item) => urlRoute === item.route);
    if (newRoute) {
      document.getElementById("title").innerText = newRoute.title;
      document.getElementById("content").innerHTML = await fetch(
        newRoute.filePath
      ).then((response) => response.text());
      newRoute.load();
    } else {
      window.location.href = "/";
    }
  }
}
