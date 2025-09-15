export class AuthUtility {

  static saveUser(user) {
    if (user.tokens) {
      localStorage.setItem("accessToken", user.tokens.accessToken);
      localStorage.setItem("refreshToken", user.tokens.refreshToken);
    }
    localStorage.setItem("user", JSON.stringify(user.user));
  }

  static removeUser() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  static getInfo(key) {
    if (key === 'user') return JSON.parse(localStorage.getItem(key));
    return localStorage.getItem(key);
  }
}
