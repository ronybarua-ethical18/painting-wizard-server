const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(bodyParser.json())
app.use(cors())
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const port = process.env.PORT || 5000

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dupbi.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookingsCollection = client.db("paintingdb").collection("bookings");
  const servicesCollection = client.db("paintingdb").collection("services");
  const reviewsCollection = client.db("paintingdb").collection("reviews");

  app.post('/addService', (req, res) => {
    const serviceData = req.body;
    servicesCollection.insertOne(serviceData)
      .then(result => {
        console.log(result);
        res.send(result.insertedCount > 0)
        
      })
  })

  // read or retrieve data from database 
  app.get('/services', (req, res) => {
    servicesCollection.find({})
      .toArray((error, documents) => {
        res.send(documents);
      })
  })

  app.post('/addReview', (req, res) => {
    const reviews = req.body;
    reviewsCollection.insertOne(reviews)
      .then(result => {
        console.log(result);
        res.send(result.insertedCount > 0)
        
      })
  })

  app.get('/reviews', (req, res) => {
    reviewsCollection.find({})
      .toArray((error, documents) => {
        res.send(documents);
      })
  })

  console.log('database connected successfully');
});

app.get('/', (req, res) => {
    res.send('Hello Painter!')
})

app.listen(port)