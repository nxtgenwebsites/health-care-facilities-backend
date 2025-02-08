import express from 'express';
import { getReports, saveData } from '../controllers/reportController.js';

const router = express.Router();

// Routes
router.post('/save', saveData);
router.get('/get-reports', getReports)

export default router;
