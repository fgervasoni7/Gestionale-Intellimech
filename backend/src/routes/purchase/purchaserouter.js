import express from 'express';
import jwt from 'jsonwebtoken';

// Setup the express router
const router = express.Router();

// Routes
import purchaseread from './purchaseread.js';
import purchasecreate from './purchasecreate.js';


router.use('/purchase', purchaseread);
router.use('/purchase', purchasecreate);


export default router;