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
    .then((res) => res.json());
}