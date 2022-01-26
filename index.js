const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const mongo = require('mongodb')
const sw = require('./website.secret.json');
const db = new mongo.MongoClient(sw.mongo_url, { useUnifiedTopology: true, useNewUrlParser: true });
const fetch = require('node-fetch');
db.connect(function (err) {
  if (err) console.log(err);
  else console.log('Database Connect!')
})

let temp = db.db("Redajs").collection("template")

app.use(bodyParser.json());
app.use(cors());

async function checkIfTemplateExists(name) {
  const template = await temp.findOne({name: name})

  return template == null;
}

// *
app.route('/')
  .get(function(req, res) {
    res.send(fs.readFileSync('./router/home/home.html', 'utf8'));
  })

// */api
app.route('/api')
  .get(function(req, res) {
    res.json({
        status: 404,
    })
  })

// */api
app.route('/api/new')
  .post(function(req, res) {
    temp.insertOne(
      {
        name: req.body.name,
        description: req.body.desc,
        git: req.body.git,
        send: req.body.send,
        exec: req.body.exec
      }
    )
    res.json({
      status: "success",
      info: {
        name: req.body.name,
        description: req.body.desc,
        git: req.body.git,
        send: req.body.send,
        exec: req.body.exec
      }
    })
  })

// */api/get&temp=:temp
app.route('/api/get&temp=:temp')
  .get(function(req, res) {
    temp.find({ name: req.params.temp }).toArray(function(err, data) {
      if (err) res.json({ status: "err" })
      else res.json({
        name: data[0].name,
        description: data[0].desc,
        git: data[0].git,
        send: data[0].send,
        exec: data[0].exec,
        status: "success"
      });
    })
  })


app.listen(60000, () => {
    console.log("Website Online!")
    /* setInterval(() => {
      fetch('http://localhost:60000/api/new', {
  method: 'POST', // or 'PUT'
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name: "hello" }),
})
.then(response => response.json())
.then(data => {
  console.log(data);
}) */
})


