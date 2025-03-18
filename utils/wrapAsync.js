function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(err => next(err)); // Ensures errors are passed to Express error handler
    };
}

module.exports = wrapAsync;