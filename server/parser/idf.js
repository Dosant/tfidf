const _ = require('lodash');
const processDocument = require('../proccessDocument');

/*
    Input: Array of documents
    Output: Map: key: stemmedWord, value: N of documents with key word
*/

module.exports = function idfPrepare(documents) {
    const idfInfo = {
        total: documents.length,
        words: {}
    };

    const processed = documents.map(processDocument).map((processed) => processed.document);

    processed.map((documentWords) => {
        return _.uniq(documentWords);
    }).forEach((uniqueDocumentWords) => {
        uniqueDocumentWords.forEach((word) => {
            if (idfInfo.words[word]) {
                idfInfo.words[word]++;
            } else {
                idfInfo.words[word] = 1;
            }
        });
    });

    return idfInfo;
};