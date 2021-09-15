const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const spendingsRoute = require('./routes/spendings')
const port = 3000
const cors = require('cors')

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use('/api/v1/spendings', spendingsRoute)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}/api/v1/`)
})

mongoose.connect('mongodb://localhost:27017/budget-app', {
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
