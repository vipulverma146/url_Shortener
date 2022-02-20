const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const app = express()
const port=process.env.PORT || 5050;

mongoose.connect('mongodb://localhost/urlShortener', {
  useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }))
// redering data on hoeme
app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls: shortUrls })
})
// posting original url
app.post('/shortUrls', async (req, res) => {
  //adding entry in db
  await ShortUrl.create({ full: req.body.fullUrl })

  res.redirect('/');
})
// redirecting to original url
app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);

})
app.listen(port,(err)=>{
    if(err){
        console.log("Error:",err);
    }
    console.log(`Server is running on port no ${port}`);
})