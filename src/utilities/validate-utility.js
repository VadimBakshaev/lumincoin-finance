export class ValidateUtility {
  static validateField(field) {
    const value = field.value;
    const rule = field.dataset.rule;
    if (value) {
      if (rule) {
        if (new RegExp(rule).test(value)) return true;
        return false;
      }
      return true;
    }
    return false;
  }

  static setStatus(element, status) {
    if (status) {
      if (element.classList.contains("is-valid")) return;
      if (element.classList.contains("is-invalid"))
        element.classList.remove("is-invalid");
      element.classList.add("is-valid");
    } else {
      if (element.classList.contains("is-invalid")) return;
      if (element.classList.contains("is-valid"))
        element.classList.remove("is-valid");
      element.classList.add("is-invalid");
    }
  }

  static validateForm(form) {
    let valid = true;
    let pass = null;
    form.forEach((element) => {
      if (element.id === "password") pass = element.value;
      if (this.validateField(element)) {
        if (element.id === "passwordRepeat" && element.value !== pass) {
          this.setStatus(element, false);
          valid = false;
          return valid;
        }
        this.setStatus(element, true);
      } else {
        this.setStatus(element, false);
        valid = false;
      }
    });
    return valid;
  }
}
