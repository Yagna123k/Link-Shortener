function generateShortUrlCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let shortUrlCode = '';
    for (let i = 0; i < 4; i++) {
        shortUrlCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return shortUrlCode;
}

module.exports = generateShortUrlCode