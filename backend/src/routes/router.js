import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';

// Setup the express router
const router = express.Router();

import auth from './auth/authrouter.js';
import user from './user/userrouter.js';

router.use('/', auth);
router.use('/', user);

export default router;