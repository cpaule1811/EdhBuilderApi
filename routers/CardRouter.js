const { Router } = require('express');
const CardHandler = require('../handlers/CardHandler');

const cardRouter = Router();

cardRouter.post('/add', (req, res) => CardHandler.add(req, res))

module.exports = cardRouter;