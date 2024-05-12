const BASE_URL = "http://localhost:8000";

export async function fetchRaw(url, method, data) {
    const requestUrl = BASE_URL + url;

    return fetch(requestUrl, {
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
    }).then((res) => {
        return res;
    });
}

export async function fetchForm(url, method, data) {
    const requestUrl = BASE_URL + url;

    return fetch(requestUrl, {
        method: method,
        body: data,
        credentials: "include",
    }).then((res) => {
        return res;
    });
}
