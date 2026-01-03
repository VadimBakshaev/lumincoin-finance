export type RequestResultType<T> = {
    status: number;
    response: T | null;
}

export type RequestResultSignupType = {
    "user": {
        "id": number,
        "email": string,
        "name": string,
        "lastName": string
    }
}

export type RequestResultErrorType = {
    "error": boolean;
    "message": string;
    "validation"?: ValidationErrorType[];
}

export type ValidationErrorType = {
    "key": string;
    "message": string;
}

export type RequestResultBalanceType = {
    "balance": number | null;
}

export type RequestResultOperationType = {
    "id": number;
    "type": string;
    "amount": number;
    "date": string;
    "comment": string;
    "category"?: string;
}

export type RequestResultCategoryType = {
    "id": number;
    "title": string;
}