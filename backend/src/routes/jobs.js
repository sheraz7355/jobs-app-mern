import express from 'express';
import { getJobs, createJob } from '../controllers/jobController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getJobs);
router.post('/', authenticate, createJob);

export default router;

