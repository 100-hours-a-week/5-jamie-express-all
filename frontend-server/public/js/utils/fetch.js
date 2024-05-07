const BASE_URL = "http://localhost:8000";
// const user_id = localStorage.getItem("user_id");
const user_id = 7;

export async function fetchRaw(url, method, data) {
    const requestUrl = BASE_URL + url;

    return fetch(requestUrl, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            user_id: user_id,
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
        headers: {
            user_id: user_id ? user_id : null,
        },
        credentials: "include",
    }).then((res) => {
        return res;
    });
}
