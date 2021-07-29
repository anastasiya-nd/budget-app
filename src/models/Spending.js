const mongoose = require('mongoose')
const { Schema } = mongoose

const spendingSchema = new Schema({
  createdAt: {
    type: Date,
    default: new Date(),
    required: true,
  },
  labels: Array,
  category: {
    type: String,
    enum: ['entertainment', 'car', 'bill', 'food', 'home', 'education', 'other'],
    required: true,
  },
  note: String,
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    enum: ['USD', 'EUR', 'RUB', 'BYN'],
    required: true,
  }
})

const Spending = mongoose.model('Spending', spendingSchema)

module.exports = { Spending }
