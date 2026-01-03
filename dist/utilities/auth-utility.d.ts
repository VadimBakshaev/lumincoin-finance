import { UserInfoType, UserType } from "../types/user.type";
export declare class AuthUtility {
    static saveUser(user: UserType): void;
    static removeUser(): void;
    static getInfo(key: string): UserInfoType | string | null;
    static refreshTokens(): Promise<boolean>;
    static checkAuthorization(): boolean;
}
//# sourceMappingURL=auth-utility.d.ts.map