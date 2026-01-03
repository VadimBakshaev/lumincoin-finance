export class ValidateUtility {
  private static validateField(field: HTMLInputElement): boolean {
    const value: string = field.value;
    const rule: string | undefined = field.dataset.rule;
    if (value) {
      if (rule) {
        if (new RegExp(rule).test(value)) return true;
        return false;
      }
      return true;
    }
    return false;
  }

  public static setStatus(element: HTMLElement, status?: boolean): void {
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

  private static validateForm(form: NodeListOf<HTMLInputElement>): boolean {
    let valid: boolean = true;
    let pass: string | null = null;
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

  public static serializeForm(form:NodeListOf<HTMLInputElement>) {
    const data:any = {};
    if (this.validateForm(form)) {
      form.forEach((element) => {
        if (element.id === 'rememberMe') {
          data[element.id] = element.checked
        } else if (element.id === 'amount' || element.id === 'category_id') {
          data[element.id] = +element.value;
        } else {
          data[element.id] = element.value;
        }
      });
      return data;
    }
    return null;
  }
}
