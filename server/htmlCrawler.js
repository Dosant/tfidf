const fetch = require('node-fetch');
const cheerio = require('cheerio');
const read = require('node-read');
const sanitizeHtml = require('sanitize-html');


/*
    Fetch html
    Get 'interesting' part with node-read
*/
function crawlHtml(url) {
    return fetch(url)
        .then((res) => res.text())
        .then((res) => {
            return new Promise((resolve, reject) => {
                read(res, (err, article) => {
                    const content = sanitizeHtml(article.content, {
                        allowedTags: ['p'],
                        allowedAttributes: false
                    });
                    var $ = cheerio.load(content);
                    var document = $.text();
                    return resolve({
                        url: url,
                        title: article.title,
                        content: content,
                        document: document
                    });
                });
            });
        });
}

module.exports = crawlHtml;