export type RequestOptionsType = {
    method: string;
    headers: {
        'Content-Type': string;
        'Accept': string;
        'x-auth-token'?: string;
    };
    body?: string;
}