import { RequestResultErrorType, RequestResultType, ValidationErrorType } from "../../types/request-result.type";
import { UserInfoType, UserType } from "../../types/user.type";
import { AuthUtility } from "../../utilities/auth-utility";
import request from "../../utilities/http-utility";
import { ValidateUtility } from "../../utilities/validate-utility";
import { KeyString } from "../../config/key-string";
import { RequestDataLoginType } from "../../types/request-data.type";

export class Login {
  private openRoute: (url: string) => Promise<void>;
  private formEl: HTMLElement | null;
  private fieldEls: NodeListOf<HTMLInputElement>;
  private emailEl: HTMLInputElement | null;
  private btnSubmitEl: HTMLElement | null;

  constructor(openRoute: (url: string) => Promise<void>) {
    this.openRoute = openRoute;
    this.formEl = document.querySelector('.form-container');
    this.fieldEls = document.querySelectorAll("input");
    this.emailEl = document.getElementById('email') as HTMLInputElement;
    this.btnSubmitEl = document.getElementById("submit");
    this.init();
  }

  private init(): void {
    if (this.formEl && this.btnSubmitEl && this.emailEl) {
      this.formEl.addEventListener('submit', this.login.bind(this));
      this.btnSubmitEl.addEventListener("click", this.login.bind(this));
      const user: UserInfoType | null = AuthUtility.getInfo(KeyString.user) as UserInfoType;
      if (user) this.emailEl.value = user.email;
    }
  }

  private async login(e: Event): Promise<void> {
    e.preventDefault();
    const data: RequestDataLoginType = ValidateUtility.serializeForm(this.fieldEls);
    if (!data) return;
    const result: RequestResultType<UserType | RequestResultErrorType> | null = await request('/login', 'POST', false, data);
    if (!result) return;
    if (result.status === 400 && (result.response as RequestResultErrorType).validation) {
      (result.response as RequestResultErrorType).validation?.forEach((item: ValidationErrorType) => {
        ValidateUtility.setStatus([...this.fieldEls].find((element: HTMLInputElement) => element.id === item.key) as HTMLElement);
      });
      return;
    };
    if (result.status === 401) {
      this.fieldEls.forEach((element: HTMLInputElement) => ValidateUtility.setStatus(element));
      return;
    };
    if (result.status === 200) {
      AuthUtility.saveUser(result.response as UserType);
      this.openRoute('/');
    }
  }
}
