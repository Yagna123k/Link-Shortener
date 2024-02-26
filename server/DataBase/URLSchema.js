const mongoose = require("mongoose")

const UrlSchema = new mongoose.Schema({
    originalURL: String,
    shortURLCode: String,
    clicks: { type: Number, default: 0 },
});

const URLs = mongoose.model('Urls', UrlSchema)

module.exports = URLs