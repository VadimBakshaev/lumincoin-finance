import { RequestDataSignupType } from "../../types/request-data.type";
import { RequestResultType, RequestResultSignupType, RequestResultErrorType, ValidationErrorType } from "../../types/request-result.type";
import { AuthUtility } from "../../utilities/auth-utility";
import request from "../../utilities/http-utility";
import { ValidateUtility } from "../../utilities/validate-utility";

export class Signup {
  private openRoute: (url: string) => Promise<void>;
  private fieldEls: NodeListOf<HTMLInputElement>;
  private emailMessageEl: HTMLElement | null;
  private btnSubmitEl: HTMLElement | null;

  constructor(openRoute: (url: string) => Promise<void>) {
    this.openRoute = openRoute;
    this.fieldEls = document.querySelectorAll(".form-control");
    this.emailMessageEl = document.getElementById('emailMessage');
    this.btnSubmitEl = document.getElementById("submit");
    this.init();
  }

  private init(): void {
    document.querySelector('.form-container')?.addEventListener('submit', this.signup.bind(this));
    this.btnSubmitEl && this.btnSubmitEl.addEventListener("click", this.signup.bind(this));
  }

  private async signup(e: Event): Promise<void> {
    e.preventDefault();
    this.emailMessageEl && (this.emailMessageEl.innerText = 'Пожалуйста введите корректный email');
    const data: RequestDataSignupType = ValidateUtility.serializeForm(this.fieldEls);
    if (!data) return;
    const result: RequestResultType<RequestResultSignupType | RequestResultErrorType> | null = await request('/signup', 'POST', false, data);
    if (result && result.status === 400) {
      if ((result.response as RequestResultErrorType).validation) {
        (result.response as RequestResultErrorType).validation?.forEach((item: ValidationErrorType) => {
          ValidateUtility.setStatus([...this.fieldEls].find((element: HTMLInputElement) => element.id === item.key) as HTMLElement);
        });
        return;
      } else {
        if (this.emailMessageEl && this.emailMessageEl.previousElementSibling) {
          ValidateUtility.setStatus(this.emailMessageEl.previousElementSibling as HTMLElement);
          this.emailMessageEl.innerText = 'Пользователь с таким E-Mail уже зарегистрирован';
        }
        return;
      }
    };
    if (result && result.status === 201) {
      AuthUtility.saveUser(result.response as RequestResultSignupType);
      this.openRoute('/login');
    }
  }
}
