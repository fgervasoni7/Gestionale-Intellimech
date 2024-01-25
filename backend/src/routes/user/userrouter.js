import express from 'express';

// Setup the express router
const router = express.Router();

// Routes
import usercreate from './usercreate.js';
import userdelete from './userdelete.js';
import userupdate from './userupdate.js';
import userread from './userread.js';

router.use('/user', usercreate);
router.use('/user', userdelete);
router.use('/user', userupdate);
router.use('/user', userread);

export default router;