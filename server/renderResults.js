'use strict';
/*
    Render tfidf results in Content String
    word -> <span class="tfidf" data-tfidf="3.2">word</span>
*/

function renderResults(document) {
    let renderedContent = document.content;

    const words = document.proccesedDocument.removedStopWords;
    const stemMapping = document.proccesedDocument.stemmMapping;
    const tfidf = document.tfidf;

    const maxTfidf = document.listTerms[0].tfidf;
    const minTfidf = document.listTerms[document.listTerms.length - 1].tfidf;
    const step = (maxTfidf - minTfidf) / 7;
    const getLevel = (val) => {
        return Math.floor(val / step);
    };

    words.forEach((word) => {
        const stemmed = stemMapping[word];
        if (!stemmed) {return ;}

        const renderValue = getLevel(tfidf[stemmed]);
        // \b for cyrrilic fix: http://breakthebit.org/post/3446894238/word-boundaries-in-javascripts-regular
        const pattern = new RegExp(`(^\|[ \n\r\t.,'\"\+!?-\»]+\|>)(${word})([ \n\r\t.,'\"\+!?-\»]+\|$\|>)(?![^<span]*>|[^<>]*<\/span)`, 'gim');
        renderedContent = renderedContent.replace(pattern, `\$1<span class="tfidf tfidf-${renderValue}">\$2</span>\$3`);
    });

    return renderedContent;
}

module.exports = renderResults;