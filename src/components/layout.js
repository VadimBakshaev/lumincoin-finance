import { AuthUtility } from "../utilities/auth-utility";
import request from "../utilities/http-utility";

export class Layout {
  constructor(openRoute) {
    this.openRoute = openRoute;
    this.navBtnEl = document.getElementById("navBtn");
    this.overlayEl = document.getElementById("overlay");
    this.navBarEl = document.getElementById("navBar");
    this.navLinkEl = document.querySelectorAll(".nav-link");
    this.selectBtnEl = document.querySelector(".nav-link.btn");
    this.selectAreaEl = document.getElementById("category-collapse");
    this.balanceEl = document.getElementById('balance');
    this.userEl = document.getElementById("user");
    this.userDialogEl = document.getElementById("userDialog");
    this.showUser();
    this.initListener();
    this.getBalance();
  }
  showUser() {
    const user = AuthUtility.getInfo('user');
    if (user) {
      document.getElementById('userName').innerText = `${user.name} ${user.lastName}`;
    } else {
      this.openRoute('/logout');
    }
  }
  initListener() {
    this.navBtnEl.addEventListener("click", this.openMenu.bind(this));
    this.navBarEl.addEventListener("click", this.closeMenu.bind(this));
    this.overlayEl.addEventListener("click", this.closeMenu.bind(this));
    this.userEl.addEventListener("click", this.openLogout.bind(this));
    this.balanceEl.addEventListener('keypress', (e) => {
      if (/^\D$/.test(e.key)) e.preventDefault();
    });
    this.balanceEl.addEventListener('focus', (e) => {
      this.balanceEl.value = parseInt(this.balanceEl.value);
    });
    this.balanceEl.addEventListener('change', async () => {
      const response = await request('/balance', 'PUT', true, { "newBalance": parseInt(this.balanceEl.value) });
      if (response && response.status === 200) {
        this.getBalance();
      }
    });
  }
  openMenu() {
    this.navBtnEl.classList.add("close");
    this.overlayEl.classList.add('open-block');
    this.navBarEl.classList.add("open");
  }
  closeMenu(e) {
    if (
      (e.target.classList.contains("nav-link") &&
        e.target.getAttribute("href") === null) ||
      e.target.closest("#user")
    )
      return;
    this.navBtnEl.classList.remove("close");
    this.overlayEl.classList.remove('open-block');
    this.navBarEl.classList.remove("open");
  }
  setActive(route) {
    this.navLinkEl.forEach((item) => {
      item.classList.remove("active");
      if (item.getAttribute("href") === route) {
        if (route === "/income" || route === "/expense") {
          this.selectBtnEl.classList.add("active");
          this.selectBtnEl.ariaExpanded = true;
          this.selectAreaEl.classList.add("show");
        } else {
          this.selectBtnEl.classList.remove("active");
          this.selectBtnEl.ariaExpanded = false;
          this.selectAreaEl.classList.remove("show");
        }
        item.classList.add("active");
      }
    });
  }
  async getBalance() {
    const response = await request('/balance');
    if (response && response.status === 200) {
      this.balanceEl.value = response.response.balance + '$';
    }
  }
  openLogout(e) {
    e.preventDefault();
    this.userDialogEl.classList.toggle("open");
  }
}
