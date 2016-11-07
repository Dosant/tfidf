'use strict';
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

app.use(require('./server/utils/responseHeaders'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(morgan('dev'));
app.use(cookieParser());

const port = 8100;
app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
});

const htmlCrawler = require('./server/htmlCrawler');
const proccessDocument = require('./server/proccessDocument');
const tfidf = require('./server/tfidf');
const renderResults = require('./server/renderResults');
app.post('/tfidf', (req, res, next) => {
    /* Get Text Content from Urls */
    const urls = req.body.urls;
    const textContentPromises = urls.map((url) => htmlCrawler(url));
    Promise.all(textContentPromises)
        .then((documents) => {
            /* Prepare documents */
            const preparedDocuments = documents.map((document) => {
                return Object.assign(document, { proccesedDocument: proccessDocument(document.document) });
            });

            /* do tf-idf */
            const tfidfResult = tfidf(preparedDocuments);

            /* render result in content */
            tfidfResult.forEach((tfidfResult) => {
                tfidfResult.tfidfContent = renderResults(tfidfResult);
            });

            res.send(tfidfResult);
        });
});

const fetchListAndDocuments = require('./server/parser/meduzaParser').fetchListAndDocuments;
const fs = require('fs');
const pQueue = require('./server/utils/utils').createPromiseQueue;
app.post('/fetchMeduza', (req, res, next) => {
    let result = JSON.parse(fs.readFileSync('./data/test.json'));

    const startPage = +req.body.startPage || 0;
    const pages = [];
    for (let i = startPage; i < startPage + 10; i++) {
        pages.push(() => fetchListAndDocuments(i)
            .then((documents) => {
                result = result.concat(documents);
            }));
    }

    pQueue(pages)
        .then(() => {
            fs.writeFileSync('./data/test.json', JSON.stringify(result, null, 4));
            res.json(result);
        });
});

/* from documents get info for idf */
const processIdf = require('./server/parser/idf');
app.post('/processDocuments', (req, res, next) => {
    const documents = JSON.parse(fs.readFileSync('./data/test.json')).map((document) => document.content);
    const proccesedDocuments = processIdf(documents);
    fs.writeFileSync('./data/idfData.json', JSON.stringify(proccesedDocuments, null, 4));
    res.json(proccesedDocuments);
});

const path = require('path');
app.use('/', express.static('tfidf-client/build/'));

