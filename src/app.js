const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const { Spending } = require('./models/Spending')
const { HTTP_STATUS_CODES } = require('./constants');
const app = express()
const port = 3000

app.use(bodyParser.json())

app.post('/', (req, res) => {
  Spending.create({
    createdAt: req.body.createdAt,
    labels: req.body.labels.split(','),
    category: req.body.category,
    note: req.body.note,
    amount: req.body.amount,
    currency: req.body.currency,
  }, function (err, spending) {
    if (err) {
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send({error: 'Internal Error - Internal server error'})
    } else {
      console.log(spending)
      res.status(HTTP_STATUS_CODES.OK).send('Successful operation')
    }
  })
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

mongoose.connect('mongodb://localhost:27017/some-mongo', {useNewUrlParser: true, useUnifiedTopology: true})

mongoose.connection.on('error', (err) => {
  console.error("Database Connection Error: " + err)
  process.exit(1)
})

mongoose.connection.once('connected', () => {
  console.info("Succesfully connected to MongoDB Database")
})
