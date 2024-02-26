const express = require("express")
const bodyParser = require("body-parser")

const app = express()
const cors = require('cors')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));


const URLCode = require("./URLCode")
const URLs = require("./DataBase/URLSchema")
const connectMongoDB = require("./DataBase/ConnectMongoDB")
connectMongoDB()

app.post('/shorten', async (req, res) => {
    const { originalURL } = req.body

    const shortURLCode = URLCode()

    const url = new URLs({
        originalURL,
        shortURLCode,
    });

    await url.save()
    res.json(url)
})

app.get("/:shortURLCode", async (req, res) => {
    const { shortURLCode } = req.params

    const url = await URLs.findOne({ shortURLCode });

    if (!url) {
        return res.status(404).json({ error: 'URL not found' });
    }

    url.clicks++;
    await url.save();

    res.redirect(url.originalURL)
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));