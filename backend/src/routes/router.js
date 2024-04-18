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
import quotationrequest from './quotationrequest/quotationrequestrouter.js';
import permission from './permission/permissionrouter.js';
import offer from './offer/offerrouter.js';
import subcategory from './subcategory/subcategoryrouter.js';
import category from './category/categoryrouter.js';
import technicalarea from './technicalarea/technicalarearouter.js';
import salesorder from './salesorder/salesorderrouter.js';

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
router.use('/', quotationrequest);  
router.use('/', permission);
router.use('/', offer);
router.use('/', subcategory);
router.use('/', category);
router.use('/', technicalarea);
router.use('/', salesorder);

export default router;