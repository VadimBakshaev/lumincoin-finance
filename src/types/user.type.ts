export type UserType = {
    tokens?: UserTokensType;
    user?: UserInfoType;
}

export type UserTokensType = {
    accessToken: string;
    refreshToken: string;
}

export type UserInfoType = {
    name: string;
    lastName: string;
    email: string;
}