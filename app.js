const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello world')
})

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
