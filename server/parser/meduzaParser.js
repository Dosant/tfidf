const api = 'https://meduza.io/api/v3';
function getListUrl(page, per_page) {
    return api + `/search?chrono=news&page=${page}&per_page=${per_page}&locale=ru`;
};
function getDocumentUrl(id) {
    return api + `/${id}`;
};

const fetch = require('node-fetch');
const cheerio = require('cheerio');

/*
    Fetch Meduza Document
*/
function fetchDocument(id) {
    console.log('Start Fetching: ', id);
    return fetch(getDocumentUrl(id))
        .then((res) => res.json())
        .then((res) => {
            console.log('Success Fetching: ', id);
            const document = res.root;
            const $ = cheerio.load(document.content.body);
            const content = $.text().replace(/\n/g, ' ');
            return {
                url: document.url,
                title: document.title,
                content: content
            };
        });
}

/*
    Fetch Meduza List
*/
function fetchList(page, per_page) {
    per_page = per_page || 10;
    console.log('Start Fetching List: ', page, per_page);
    return fetch(getListUrl(page, per_page))
        .then((res) => res.json())
        .then((res) => {
            console.log('Success Fetching List: ', page, per_page);
            return res.collection;
        });
}

/*
    Fetch List And Documents
*/
function fetchListAndDocuments(page, per_page) {
    return fetchList(page, per_page)
        .then((collection) => {
            return Promise.all(collection.map((item) => fetchDocument(item)));
        });
}

const meduzaParser = {
    fetchDocument,
    fetchList,
    fetchListAndDocuments
};

module.exports = meduzaParser;
