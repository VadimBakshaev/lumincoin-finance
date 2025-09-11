import { ValidateUtility } from "../../utilities/validate-utility";

export class Signup {
  constructor() {
    this.fieldEls = document.querySelectorAll(".form-control");
    this.btnSubmitEl = document.getElementById("submit");
    this.btnSubmitEl.addEventListener("click", this.serializeForm.bind(this));
  }
  serializeForm() {
    this.data = {};
    if (ValidateUtility.validateForm(this.fieldEls)) {
      this.fieldEls.forEach((element) => {
        if (element.id !== "passwordRepeat") {
          this.data[element.id] = element.value;
        }
      });
    }

    console.log(this.data);
  }
}
