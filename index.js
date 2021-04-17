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
  const adminsCollection = client.db("paintingdb").collection("admins");
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

  app.post('/addBooking', (req, res) => {
    const bookings = req.body;
    bookingsCollection.insertOne(bookings)
      .then(result => {
        console.log(result);
        res.send(result.insertedCount > 0)

      })
  })

  app.get('/orders', (req, res) => {
    bookingsCollection.find({})
      .toArray((error, documents) => {
        res.send(documents);
      })
  })

  app.patch(`/updateBooking/:id`, (req, res) => {
    bookingsCollection.updateOne({ _id: ObjectId(req.params.id) },
      {
        $set: { status: req.body.status }
      })
      .then(result => {
        res.send(result.modifiedCount > 0);
        console.log(result);
      });
  })

  //get a single item by id
  app.get('/service/:id', (req, res) => {
    servicesCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((error, documents) => {
        res.send(documents[0]);
      })
  })

  //get item by email
  app.get('/bookings', (req, res) => {
    bookingsCollection.find({ email: req.query.email })
      .toArray((error, documents) => {
        res.status(200).send(documents);
      })
  })

  // delete service from database 
  app.delete('/deleteService/:id', (req, res) => {
    console.log(req.params.id)
    servicesCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        console.log(result)
        res.send(result.deletedCount > 0);

      })
  })

  // add admin to database
  app.post('/addAdmin', (req, res) => {
    const admin = req.body;
    adminsCollection.insertOne(admin)
      .then(result => {
        console.log(result);
        res.send(result.insertedCount > 0)

      })
  })

  // is admin or normal user 
  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminsCollection.find({ email: email })
      .toArray((err, doctors) => {
        res.send(doctors.length > 0)
      })
  })
  console.log('database connected successfully');
});

app.get('/', (req, res) => {
  res.send('Hello Painter!')
})

app.listen(port)