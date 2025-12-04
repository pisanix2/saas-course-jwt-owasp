const express = require('express');
const router = express.Router();

const basicAuthRoutes = require('./basic');
const { router: jwtAuthRoutes } = require('./jwt');

router.use('/', basicAuthRoutes);
router.use('/', jwtAuthRoutes);

module.exports = router;
