export type RequestDataSignupType = {
    "name": string;
    "lastName": string;
    "email": string;
    "password": string;
    "passwordRepeat": string;
};
export type RequestDataLoginType = {
    "email": string;
    "password": string;
    "rememberMe": boolean;
};
export type RequestDataCategoryType = {
    "title": string;
};
export type RequestDataOperationType = {
    "type": string;
    "amount": number;
    "date": string;
    "comment": string;
    "category_id": number;
};
//# sourceMappingURL=request-data.type.d.ts.map