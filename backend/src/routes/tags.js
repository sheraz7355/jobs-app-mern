import express from 'express';
import { getJobsByTag } from '../controllers/tagController.js';

const router = express.Router();

router.get('/:name', getJobsByTag);

export default router;

