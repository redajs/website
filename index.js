const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(cors());

// *
app.route('/')
  .get(function(req, res) {
    res.send(fs.readFileSync('./router/home.html', 'utf8'));
  })


app.listen(60000, () => {
    console.log("Website Online!")
})