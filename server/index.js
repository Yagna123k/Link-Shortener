const express = require("express")
const bodyParser = require("body-parser")

const app = express()
const cors = require('cors')

app.use(cors({
    origin: 'http://localhost:5173', // Specify the exact origin
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type',
    credentials: true,
}));

app.use(express.json())

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(cors())


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
    // console.log("shortURLCode: ", shortURLCode);

    const url = await URLs.findOne({ shortURLCode });
    // console.log("url: ", url);

    if (!url) {
        return res.status(404).json({ error: 'URL not found' });
    }

    url.clicks++;
    await url.save();
    console.log(url.originalURL);
    res.redirect(url.originalURL)


})

app.get("/",(req,res)=>{
    res.send("Welcome")
})
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));