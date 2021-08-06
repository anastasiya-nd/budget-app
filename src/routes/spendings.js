const express = require('express')
const controller = require('../controllers/spendings')

const router = express()

router.post('/', controller.createSpending)
router.get('/', controller.getSpendings)
router.delete('/:id', controller.deleteSpending)
router.get('/:id', controller.getSpending)
router.patch('/:id', controller.updateSpending)

module.exports = router
