import api from "../config/api";
import { KeyString } from "../config/key-string";
import { RequestOptionsType } from "../types/request-options.type";
import { RequestResultType } from "../types/request-result.type";
import { AuthUtility } from "./auth-utility";

async function request<T>(url: string, method: string = 'GET', auth: boolean = true, data: any = null): Promise<RequestResultType<T> | null> {
    let response: Response | null = null;
    const result: RequestResultType<T> = {
        status: 0,
        response: null
    };
    const options: RequestOptionsType = {
        method: method,
        headers: {
            'Content-Type': "application/json",
            'Accept': "application/json",
        }
    };
    if (auth) {
        options.headers['x-auth-token'] = AuthUtility.getInfo(KeyString.accessToken) as string;
    };
    if (data) options.body = JSON.stringify(data);
    try {
        response = await fetch(api + url, options);
    } catch (e) {
        console.error(e);
    }
    if (!response) return null;
    if (response.status < 200 || response.status >= 300) {
        if (response.status === 401 && response.statusText === 'Unauthorized') {
            if (await AuthUtility.refreshTokens()) {
                return request(url, method, auth, data);
            }
        }
        AuthUtility.removeUser();
    }
    result.status = response.status;
    result.response = await response.json();
    return result;
}
export default request;