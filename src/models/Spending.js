const mongoose = require('mongoose')
const { Schema } = mongoose

const spendingSchema = new Schema({
  createdAt: {
    type: Date,
    default: new Date(),
    required: true
  },
  labels: Array,
  category: {
    type: String,
    enum: ['shopping', 'entertainment', 'car', 'bills', 'food', 'home', 'education', 'other'],
    required: true
  },
  note: String,
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    enum: ['usd', 'eur', 'rub', 'byn'],
    required: true
  }
})

const Spending = mongoose.model('Spending', spendingSchema)

module.exports = { Spending }
