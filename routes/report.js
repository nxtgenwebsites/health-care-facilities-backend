import express from 'express';
import { deleteData, editData, getReports, saveData } from '../controllers/reportController.js';

const router = express.Router();

// Routes
router.post('/save', saveData);
router.get('/get-reports', getReports)
router.put('/edit', editData)
router.delete('/delete', deleteData)

export default router;