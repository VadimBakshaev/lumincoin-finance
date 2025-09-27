import { AuthUtility } from "../../utilities/auth-utility";
import request from "../../utilities/http-utility";
import { ValidateUtility } from "../../utilities/validate-utility";

export class Signup {
  constructor(openRoute) {
    this.openRoute = openRoute;
    this.fieldEls = document.querySelectorAll(".form-control");
    this.emailMessageEl = document.getElementById('emailMessage');
    this.btnSubmitEl = document.getElementById("submit");
    this.btnSubmitEl.addEventListener("click", this.signup.bind(this));
  }

  async signup() {
    this.emailMessageEl.innerText = 'Пожалуйста введите корректный email';
    const data = ValidateUtility.serializeForm(this.fieldEls);
    if (!data) return;
    const result = await request('/signup', 'POST', false, data);
    if (result.status === 400) {
      if (result.response.validation) {
        result.response.validation.forEach((item) => {
          ValidateUtility.setStatus([...this.fieldEls].find((element) => element.id === item.key));
        });
        return;
      } else {
        ValidateUtility.setStatus(this.emailMessageEl.previousElementSibling);
        this.emailMessageEl.innerText = 'Пользователь с таким E-Mail уже зарегистрирован';
        return;
      }
    };
    if (result.status === 201) {
      AuthUtility.saveUser(result.response);
      this.openRoute('/login');
    }
  }
}
