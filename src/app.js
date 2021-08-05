const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const { Spending } = require('./models/Spending')
const { HTTP_STATUS_CODES } = require('./constants')
const app = express()
const port = 3000

app.use(bodyParser.json())

app.post('/spendings', (req, res) => {
  Spending.create({
    createdAt: req.body.createdAt,
    labels: req.body.labels,
    category: req.body.category,
    note: req.body.note,
    amount: req.body.amount,
    currency: req.body.currency
  }, function (err, spending) {
    if (err) {
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ error: 'Internal Error - Internal server error' })
    } else {
      res.status(HTTP_STATUS_CODES.OK).send('Successful operation')
    }
  })
})

const setFilters = (links) => {
  const filter = {}

  links.forEach(link => {
    if (link.value) {
      if (!Object.keys(filter).includes(link.name)) {
        filter[link.name] = (link.key) ? ({ [link.key]: link.value }) : link.value
      } else {
        const obj = filter[link.name]
        obj[link.key] = link.value
      }
    }
  })

  return filter
}

app.get('/spendings', (req, res) => {
  const {
    page = 1,
    perPage = 5,
    category,
    labels,
    start,
    end
  } = req.query

  if (page < 1) {
    return res
      .status(HTTP_STATUS_CODES.BAD_REQUEST)
      .send({ error: '\'page\' should be greater than 0' })
  }

  const links = [
    { name: 'category', value: category },
    { name: 'labels', value: labels ? labels.split(',') : undefined, key: '$in' },
    { name: 'createdAt', value: start, key: '$gte' },
    { name: 'createdAt', value: end, key: '$lte' }
  ]

  const filter = setFilters(links)

  Spending.countDocuments(filter, (err, count) => {
    if (err) {
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ error: 'Internal Error - Internal server error' })
    } else {
      Spending.find(filter, (err, spendings) => {
        if (err) {
          res
            .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
            .send({ error: 'Internal Error - Internal server error' })
        } else {
          res.status(HTTP_STATUS_CODES.OK).send({
            spendings: spendings,
            pagination: {
              total: Math.ceil(count / perPage),
              page,
              perPage
            }
          })
        }
      }).sort({ createdAt: -1 }).limit(+perPage).skip((page - 1) * perPage)
    }
  })
})

app.delete('/spendings/:id', (req, res) => {
  const id = req.params.id

  Spending.findByIdAndDelete(id, function (err) {
    if (err) {
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ error: 'Internal Error - Internal server error' })
    } else {
      res.status(HTTP_STATUS_CODES.OK).send('Successful operation')
    }
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

mongoose.connect('mongodb://localhost:27017/some-mongo', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

mongoose.connection.on('error', (err) => {
  console.error('Database Connection Error: ' + err)
  process.exit(1)
})

mongoose.connection.once('connected', () => {
  console.info('Succesfully connected to MongoDB Database')
})
