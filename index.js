const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const PORT = 3000;

mongoose.connect('mongodb://localhost/url-shortener', {
    useNewUrlParser: true, useUnifiedTopology: true
});
const db = mongoose.connection;
console.log("DB connection started")
db.on('error', console.error.bind(console, "Error in connecting to mongoDB"));

db.once('open', function () {
    console.log('Connected to Database::MongoDB');

});
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find();
    res.render('index', { shortUrls });
});

app.post('/shortUrls', async (req, res) => {
    // check if fullurl already exist 

    await ShortUrl.create({ full: req.body.fullUrl });
    res.redirect('/');
});

app.get('/go/:shortUrl', async (req, res) => {
    // console.log(req.params.shortUrl);
    const su = await ShortUrl.findOne({ short: req.params.shortUrl });
    // delete everything present in shorturl schema 
    // console.log(su);
    if (!su) {
        // console.log("No such short url");
        res.redirect(su.full);
    }

    // console.log(su._id);
    su.clicks++;
    await su.save();
    res.redirect(su.full);

});

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});