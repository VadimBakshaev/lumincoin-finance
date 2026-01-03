import api from "../config/api";
import { UserInfoType, UserType } from "../types/user.type";
import { KeyString } from "../config/key-string";

export class AuthUtility {

  public static saveUser(user: UserType): void {
    if (user.tokens) {
      localStorage.setItem(KeyString.accessToken, user.tokens.accessToken);
      localStorage.setItem(KeyString.refreshToken, user.tokens.refreshToken);
    }
    if (user.user) localStorage.setItem(KeyString.user, JSON.stringify(user.user));
  }

  public static removeUser(): void {
    localStorage.removeItem(KeyString.accessToken);
    localStorage.removeItem(KeyString.refreshToken);
    localStorage.removeItem(KeyString.user);
  }

  public static getInfo(key: string): UserInfoType | string | null {
    if (key === KeyString.user) {
      const infoItem: string | null = localStorage.getItem(key);
      if (infoItem) return JSON.parse(infoItem);
      return null;
    }
    return localStorage.getItem(key);
  }

  public static async refreshTokens(): Promise<boolean> {
    const token: string | null = this.getInfo(KeyString.refreshToken) as string;
    if (token) {
      let resp: Response | null = null;
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
        const tokens: UserType = await resp.json();
        this.saveUser(tokens);
        return true;
      }
    }
    return false;
  }

  public static checkAuthorization():boolean {
    if (this.getInfo(KeyString.accessToken)) return true;
    return false;
  }
}
