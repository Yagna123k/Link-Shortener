const express = require("express")
const bodyParser = require("body-parser")

const app = express()
const cors = require('cors')

app.use(cors({
    origin: ['https://genshortlink.vercel.app','http://localhost:5173'],
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type',
    credentials: true,
}));

app.use(express.json())

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

app.get("/", async (req, res) => {
    try {
        const allData = await URLs.find()
        res.status(200).json(allData)
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ err: 'Internal Server Error' })
    }
})
app.get("/get/:shortURLCode", async (req, res) => {
    const { shortURLCode } = req.params

    const url = await URLs.findOne({ shortURLCode });
    // console.log("url: ", url);

    if (!url) {
        return res.status(404).json({ error: 'URL not found' });
    }
    res.json(url)
})

app.get("/:shortURLCode", async (req, res) => {
    const { shortURLCode } = req.params
    // console.log("shortURLCode: ", shortURLCode);

    const url = await URLs.findOne({ shortURLCode });
    // console.log("url: ", url);

    if (!url) {
        return res.status(404).json({ error: 'URL not found' });
    }

    url.clicks++;
    await url.save()
    res.redirect(url.originalURL)
})

app.get("/", (req, res) => {
    res.send("Welcome")
})
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));