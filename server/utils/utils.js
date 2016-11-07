module.exports = {
    createPromiseQueue: createPromiseQueue
};

function createPromiseQueue(array) {
    return array.reduce(function (pacc, fn) {
        return pacc = pacc.then(fn);
    }, Promise.resolve());
}