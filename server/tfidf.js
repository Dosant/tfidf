'use strict';

module.exports = doTfidf;
function doTfidf(documents) {
    documents.forEach((document) => {
        const words = document.proccesedDocument.document;
        const tfResults = tf(words);

        const tfidfResults = {};
        let listTerms = [];
        Object.keys(tfResults)
            .forEach((word) => {
                const tfidf = tfResults[word] * idf(word);
                tfidfResults[word] = tfidf;
                listTerms.push({term: word, tfidf: tfidf});
            });

        listTerms.sort((a, b) => b.tfidf - a.tfidf);

        /* want list terms to be actual words, but not stemmed version */
        listTerms = listTerms.map((stemmed) => {
            return {
                tfidf: stemmed.tfidf,
                term: document.proccesedDocument.stemBackMapping[stemmed.term],
                stemmedTerm: stemmed.term
            };
        });

        document.tfidf = tfidfResults;
        document.listTerms = listTerms;
    });

    return documents;
}

function tf(words) {
    const tf = {};
    words.forEach((w) => {
        if (tf[w]) {
            tf[w]++;
        } else {
            tf[w] = 1;
        }
    });
    return tf;
}

const fs = require('fs');
const idfData = JSON.parse(fs.readFileSync('./data/idfData.json'));
function idf(word) {
    const docsWithWord = (idfData.words[word] ? idfData.words[word] : 0) + 1;
    return 1 + Math.log((idfData.total + 1) / ( 1 + docsWithWord));
}



