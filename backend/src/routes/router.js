import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

// Setup the express router
const router = express.Router();

import auth from './auth/authrouter.js';
import user from './user/userrouter.js';
import company from './company/companyrouter.js';
import invoices from './invoices/invoicerouter.js';
import roles from './role/rolerouter.js';
import group from './group/grouprouter.js';

router.use((req, res, next) => {
    // Log the request
    logger('debug',`Request: ${req.method} ${req.originalUrl} | From: ${(req.ip == '::1') ? 'localhost' : req.ip}`, req, 'mainrouter');
    next();
});

router.use('/', auth);
router.use('/', user);
router.use('/', company);
router.use('/', invoices);
router.use('/', roles);
router.use('/', group);

export default router;