import api from "../config/api";

export class AuthUtility {

  static saveUser(user) {
    if (user.tokens) {
      localStorage.setItem("accessToken", user.tokens.accessToken);
      localStorage.setItem("refreshToken", user.tokens.refreshToken);
    }
    if (user.user) localStorage.setItem("user", JSON.stringify(user.user));
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

  static async refreshTokens() {
    const token = this.getInfo('refreshToken');
    if (token) {
      let resp = null;
      try {
        resp = await fetch(api + '/refresh', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken: token })
        });
      } catch (e) {
        console.error(e)
      }
      if (resp && resp.status === 200) {
        const tokens = await resp.json();
        this.saveUser(tokens);
        return true;
      }
    }    
    return false;
  }

  static checkAuthorization(){
    if (this.getInfo('accessToken')) return true;
    return false;
  }
}
