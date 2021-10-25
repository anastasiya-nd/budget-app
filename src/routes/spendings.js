const express = require('express')
const controller = require('../controllers/spendings')

const router = express()

router.post('/spendings', controller.createSpending)
router.get('/spendings', controller.getSpendings)
router.delete('/spendings/:id', controller.deleteSpending)
router.get('/spendings/:id', controller.getSpending)
router.patch('/spendings/:id', controller.updateSpending)
router.get('/chart', controller.getChartData)

module.exports = router
