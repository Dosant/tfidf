const fetch = require('node-fetch');
const cheerio = require('cheerio');
const read = require('node-read');

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
                    var $ = cheerio.load(article.content);
                    var document = $.text().replace(/\n/g, '');
                    return resolve({
                        url: url,
                        title: article.title,
                        content: article.content,
                        document: document
                    });
                });
            });
        });
}

module.exports = crawlHtml;