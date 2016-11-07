const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const stopword = require('stopword');

/*
    tokenize
    remove stopwords
    stem
*/

function proccessDocument(document) {
    const tokenized = tokenizer.tokenize(document);
    const removedStopWords = stopword.removeStopwords(tokenized, stopword.ru);

    const stemMapping = {};
    const stemmed = removedStopWords.map((w) => {
        const stemW = natural.PorterStemmerRu.stem(w);
        stemMapping[w] = stemW;
        return stemW;
    });
    return {
        document: stemmed,
        removedStopWords: removedStopWords,
        stemmMapping: stemMapping,
    };
}

module.exports = proccessDocument;