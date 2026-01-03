import { AuthUtility } from "../../utilities/auth-utility";
import request from "../../utilities/http-utility";
import { KeyString } from "../../config/key-string";

export class Logout {
    private openRoute: (url: string) => Promise<void>;
    private refreshToken: string | null;

    constructor(openRoute: (url: string) => Promise<void>) {
        this.openRoute = openRoute;        
        this.refreshToken = AuthUtility.getInfo(KeyString.refreshToken) as string;
        
        this.logout();
    };

    private async logout(): Promise<void> {
        if (!this.refreshToken) {
            AuthUtility.removeUser();
            return this.openRoute('/login');
        };
        await request('/logout', 'POST', false, { refreshToken: this.refreshToken } as object);
        AuthUtility.removeUser();
        this.openRoute('/login');
    };
}