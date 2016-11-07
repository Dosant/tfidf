// const server = 'http://localhost:8100';
const server = '';

export function tfidf(urls) {
    return fetch(server + '/tfidf', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({urls: urls})
    })
    .then(checkStatus);
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response.json();
    } else {
        return response.json()
            .then((err) => {
                return Promise.reject(err);
            });
    }
}