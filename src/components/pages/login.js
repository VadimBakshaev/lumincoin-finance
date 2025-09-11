import { ValidateUtility } from "../../utilities/validate-utility";

export class Login {
  constructor() {
    this.fieldEls = document.querySelectorAll(".form-control");
    this.btnSubmitEl = document.getElementById("submit");
    this.btnSubmitEl.addEventListener("click", this.serializeForm.bind(this));
  }
  serializeForm() {
    this.data = {};
    if (ValidateUtility.validateForm(this.fieldEls)) {
      this.fieldEls.forEach((element) => {
        this.data[element.id] = element.value;
      });
    }

    console.log(this.data);
  }
}
