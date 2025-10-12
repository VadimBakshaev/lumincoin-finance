import api from "../config/api";
import { AuthUtility } from "./auth-utility";

async function request(url, method = 'GET', auth = true, data = null) {
    let response = null;
    const result = {};
    const options = {
        method: method,
        headers: {
            "Content-Type": "application/json",
            'Accept': "application/json",
        }
    };
    if (auth) {
        options.headers['x-auth-token'] = AuthUtility.getInfo('accessToken');
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