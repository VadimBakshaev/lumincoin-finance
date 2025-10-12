import { AuthUtility } from "../../utilities/auth-utility";
import request from "../../utilities/http-utility";

export class Logout {
    constructor(openRoute) {
        this.openRoute = openRoute;
        this.refreshToken = AuthUtility.getInfo('refreshToken');
        if (!this.refreshToken) {
            AuthUtility.removeUser();
            return openRoute('/login');
        };
        this.logout();
    };

    async logout() {
        await request('/logout', 'POST', false, { refreshToken: this.refreshToken });
        AuthUtility.removeUser();
        this.openRoute('/login');
    };
}