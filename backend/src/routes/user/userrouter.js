import express from 'express';
import jwt from 'jsonwebtoken';

// Setup the express router
const router = express.Router();

// Routes
import usercreate from './usercreate.js';
import userdelete from './userdelete.js';
import userupdate from './userupdate.js';
import userread from './userread.js';
import userconfig from './userconfig.js';
import logger from '../../utils/logger.js';

router.use('/user', usercreate);
router.use('/user', userdelete);
router.use('/user', userupdate);
router.use('/user', userread);
router.use('/user', userconfig);

export default router;