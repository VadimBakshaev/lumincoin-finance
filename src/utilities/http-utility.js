import api from "../config/api";

async function request(url, data) {
    let response = null;
    try {
        response = await fetch(api + url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Accept': "application/json",
            },
            body: JSON.stringify(data),
        });
    } catch (e) {
        console.error(e);
    }
    const result = {
        status: response.status
    };
    result.response = await response.json();
    if (response.status < 200 || response.status >= 300) {
        //to do
        console.log(response);
    }
    return result;
}
export default request;