// const natural = require('natural');
// const TfIdf = natural.TfIdf;

/* use natural js tfidf implementaion */
/* TODO: make custom solution */

// function doTfidf(documents) {
//     const tfidf = new TfIdf();

//     /* add documents to corpus */
//     documents.forEach((document) => {
//         tfidf.addDocument(document.proccesedDocument.document);
//     });

//     /* proccess tfidf for each document */
//     return documents.map((document, idx) => {
//         const listTerms = tfidf.listTerms(idx);
//         const tfidfTerms = {};
//         listTerms.forEach((term) => {
//             tfidfTerms[term.term] = term.tfidf;
//         });

//         return Object.assign(document, {tfidf: tfidfTerms, listTerms});
//     });
// }

module.exports = doTfidf;
function doTfidf(documents) {
    documents.forEach((document) => {
        const words = document.proccesedDocument.document;
        const tfResults = tf(words);

        const tfidfResults = {};
        const listTerms = [];
        Object.keys(tfResults)
            .forEach((word) => {
                const tfidf = tfResults[word] * idf(word);
                tfidfResults[word] = tfidf;
                listTerms.push({term: word, tfidf: tfidf});
            });

        listTerms.sort((a, b) => b.tfidf - a.tfidf);

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



