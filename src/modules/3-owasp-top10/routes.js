const express = require('express');
const router = express.Router();

const idorRoutes = require('./A01-broken-access-control/idor');
const cryptoRoutes = require('./A02-cryptographic-failures/sensitive-data');
const injectionRoutes = require('./A03-injection/sql-injection');
const misconfigRoutes = require('./A05-security-misconfig/error-handling');
const authFailRoutes = require('./A07-auth-failures/brute-force');
const loggingRoutes = require('./A09-logging/logging');

router.use('/a01', idorRoutes);
router.use('/a02', cryptoRoutes);
router.use('/a03', injectionRoutes);
router.use('/a05', misconfigRoutes);
router.use('/a07', authFailRoutes);
router.use('/a09', loggingRoutes);

module.exports = router;
