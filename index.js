var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios').default;
var db;
const port = 9000;
app.listen(port);
app.use(bodyParser.json());
app.use(cors());

 

/*mongoose.connect(
  "mongodb+srv://rakesh:rocman911@finexus.ujjck.mongodb.net/Finexus?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err, database) {
      if (err) return console.log("error ", err);
       
    db = database;
    console.log("App is listening on port " + port);
  }
);*/
app.get('/', (req, res) => {
  console.log('start');
  res.send('Hello');
});

app.post('/api/register', (req, res) => {
  console.log('inside ', req.body);
  var conn = mongoose.connection;
  var ObjectID = require('mongodb').ObjectID;

  var user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    workEmail: req.body.workEmail,
    phone: req.body.phone,
    company: req.body.company,
    _id: new ObjectID()
  };
  conn
    .collection('decemberWebinar')
    .find({ workEmail: req.body.workEmail })
    .toArray(function (err, result) {
      console.log(result);
      if (result.length > 0) return res.json({ data: 'already registered' });
      else {
        conn.collection('decemberWebinar').insertOne(user);
        res.json({ data: 'record added' });
      }
    });
});

app.post('/registrants', (req, res) => {
  console.log('inside ', req.body);
  axios
    .post(
      `https://api.zoom.us/v2/webinars/${req.body.webinarId}/registrants`,
      {
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        email: req.body.email,
        country: req.body.country,
        phone: req.body.phone,
        job_title: req.body.jobTitle,
        org: req.body.companyName
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: req.body.bearer
        }
      }
    )
    .then(() => {
      console.log('send json');
      res.json({ data: 'record added' });
    })
    .catch((err) => {
      console.log('====================================');
      console.log(err);
      console.log('====================================');
    });
});

module.exports = router;
