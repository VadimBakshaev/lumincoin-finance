import { AuthUtility } from "../../utilities/auth-utility";
import request from "../../utilities/http-utility";
import { ValidateUtility } from "../../utilities/validate-utility";

export class Login {
  constructor(openRoute) {
    this.openRoute = openRoute;
    this.fieldEls = document.querySelectorAll("input");
    this.emailEl = document.getElementById('email');
    this.btnSubmitEl = document.getElementById("submit");
    this.btnSubmitEl.addEventListener("click", this.login.bind(this));
    const user = AuthUtility.getInfo('user');
    if (user) this.emailEl.value = user.email;
  }

  async login() {
    const data = ValidateUtility.serializeForm(this.fieldEls);
    if (!data) return;
    const result = await request('/login', 'POST', false, data);
    if (result.status === 400 && result.response.validation) {
      result.response.validation.forEach((item) => {
        ValidateUtility.setStatus([...this.fieldEls].find((element) => element.id === item.key))
      });
      return;
    };
    if (result.status === 401) {
      this.fieldEls.forEach(element => ValidateUtility.setStatus(element));
      return;
    };
    if (result.status === 200) {
      AuthUtility.saveUser(result.response);
      this.openRoute('/');
    }
  }
}
