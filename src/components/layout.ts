import { RequestResultBalanceType, RequestResultErrorType, RequestResultType } from "../types/request-result.type";
import { UserInfoType } from "../types/user.type";
import { AuthUtility } from "../utilities/auth-utility";
import request from "../utilities/http-utility";

export class Layout {
  private openRoute: ((url: string) => Promise<void>) | undefined;
  private navBtnEl: HTMLElement | null;
  private overlayEl: HTMLElement | null;
  private navBarEl: HTMLElement | null;
  private navLinkEl: NodeListOf<Element>;
  private selectBtnEl: HTMLElement | null;
  private selectAreaEl: HTMLElement | null;
  private balanceEl: HTMLInputElement | null;
  private userEl: HTMLElement | null;
  private userDialogEl: HTMLElement | null;

  constructor(openRoute?: (url: string) => Promise<void>) {
    openRoute && (this.openRoute = openRoute);
    this.navBtnEl = document.getElementById("navBtn");
    this.overlayEl = document.getElementById("overlay");
    this.navBarEl = document.getElementById("navBar");
    this.navLinkEl = document.querySelectorAll(".nav-link");
    this.selectBtnEl = document.querySelector(".nav-link.btn");
    this.selectAreaEl = document.getElementById("category-collapse");
    this.balanceEl = document.getElementById('balance') as HTMLInputElement;
    this.userEl = document.getElementById("user");
    this.userDialogEl = document.getElementById("userDialog");
    this.showUser();
    this.initListener();
    this.getBalance();
  }

  private showUser(): void {
    const user: UserInfoType | null = AuthUtility.getInfo('user') as UserInfoType;
    if (user) {
      const userNameEl: HTMLElement | null = document.getElementById('userName');
      userNameEl && (userNameEl.innerText = `${user.name} ${user.lastName}`);
    } else {
      this.openRoute && this.openRoute('/logout');
    }
  }

  private initListener(): void {
    if (this.navBtnEl && this.navBarEl && this.overlayEl && this.userEl && this.userEl && this.balanceEl) {
      this.navBtnEl.addEventListener("click", this.openMenu.bind(this));
      this.navBarEl.addEventListener("click", this.closeMenu.bind(this));
      this.overlayEl.addEventListener("click", this.closeMenu.bind(this));
      this.userEl.addEventListener("click", this.openLogout.bind(this));
      this.balanceEl.addEventListener('keypress', (e) => {
        if (/^\D$/.test(e.key)) e.preventDefault();
      });
      this.balanceEl.addEventListener('focus', (e) => {
        this.balanceEl!.value = parseInt(this.balanceEl!.value).toString();
      });
      this.balanceEl.addEventListener('change', async () => {
        if (this.balanceEl?.value) {
          const response: RequestResultType<RequestResultErrorType | object> | null = await request('/balance', 'PUT', true, { "newBalance": parseInt(this.balanceEl.value as string) });
          if (response && response.status === 200) {
            this.getBalance();
          }
        }
      });
    }
  }

  private openMenu(): void {
    if (this.navBtnEl && this.overlayEl && this.navBarEl) {
      this.navBtnEl.classList.add("close");
      this.overlayEl.classList.add('open-block');
      this.navBarEl.classList.add("open");
    }
  }

  private closeMenu(e: Event): void {
    if (e.target &&
      e.target instanceof HTMLElement &&
      this.navBtnEl &&
      this.overlayEl &&
      this.navBarEl) {
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
  }

  public setActive(route: string): void {
    this.navLinkEl.forEach((item: Element) => {
      item.classList.remove("active");
      if (
        item.getAttribute("href") === route &&
        this.selectBtnEl &&
        this.selectAreaEl
      ) {
        if (route === "/income" || route === "/expense") {
          this.selectBtnEl.classList.add("active");
          this.selectBtnEl.ariaExpanded = 'true';
          this.selectAreaEl.classList.add("show");
        } else {
          this.selectBtnEl.classList.remove("active");
          this.selectBtnEl.ariaExpanded = 'false';
          this.selectAreaEl.classList.remove("show");
        }
        item.classList.add("active");
      }
    });
  }

  public async getBalance(): Promise<void> {
    const response: RequestResultType<RequestResultBalanceType | RequestResultErrorType> | null = await request('/balance');
    if (response && response.status === 200 && this.balanceEl) {
      this.balanceEl.value = (response.response as RequestResultBalanceType).balance + '$';
    }
  }

  private openLogout(e: Event): void {
    e.preventDefault();
    this.userDialogEl && this.userDialogEl.classList.toggle("open");
  }
}
