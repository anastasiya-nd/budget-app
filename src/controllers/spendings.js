const { Spending } = require('../models/Spending')
const { HTTP_STATUS_CODES } = require('../constants')

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

const getSpendings = async (req, res) => {
  try {
    const {
      page,
      perPage,
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

    const count = await Spending.countDocuments(filter)

    const spendings = await Spending.find(filter).sort({ createdAt: -1 }).limit(+perPage).skip((page - 1) * perPage)

    res.status(HTTP_STATUS_CODES.OK).send({
      spendings: spendings,
      pagination: {
        total: Math.ceil(count / perPage),
        page,
        perPage
      }
    })
  } catch (error) {
    res
      .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send({ error: 'Internal Error - Internal server error' })
  }
}

const createSpending = async (req, res) => {
  try {
    const spending = await Spending.create({
      createdAt: req.body.createdAt,
      labels: req.body.labels,
      category: req.body.category,
      note: req.body.note,
      amount: req.body.amount,
      currency: req.body.currency
    })

    res.status(HTTP_STATUS_CODES.OK).send(spending)
  } catch (error) {
    res
      .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send({ error: 'Internal Error - Internal server error' })
  }
}

const deleteSpending = async (req, res) => {
  try {
    const id = req.params.id

    await Spending.findByIdAndDelete(id)
    res.status(HTTP_STATUS_CODES.OK).send('Successful operation')
  } catch (error) {
    res
      .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send({ error: 'Internal Error - Internal server error' })
  }
}

const getSpending = async (req, res) => {
  try {
    const id = req.params.id

    const spending = await Spending.findById(id)
    res.status(HTTP_STATUS_CODES.OK).send(spending)
  } catch (error) {
    res
      .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send({ error: 'Internal Error - Internal server error' })
  }
}

const updateSpending = async (req, res) => {
  try {
    const { ...values } = req.body
    const id = req.params.id

    const spending = await Spending.findByIdAndUpdate(id, values, { new: true })
    res.status(HTTP_STATUS_CODES.OK).send(spending)
  } catch (error) {
    res
      .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send({ error: 'Internal Error - Internal server error' })
  }
}

module.exports = {
  getSpendings,
  createSpending,
  deleteSpending,
  getSpending,
  updateSpending
}
