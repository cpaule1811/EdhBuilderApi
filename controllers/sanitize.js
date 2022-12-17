var sanitizer = require('sanitizer');

const sanitizeData = (req, res, next) => {
    if (req.body) {
        for (const key in req.body) {
            req.body[key] = sanitizer.sanitize(req.body[key])
        }
    }
    if (req.query) {
        req.query.name = sanitizer.sanitize(req.query.name)
    }
    if (req.params) {
        for (const key in req.params) {
            req.params[key] = sanitizer.sanitize(req.params[key])
        }
    }
    next()
}

module.exports = {
    sanitizeData: sanitizeData
}