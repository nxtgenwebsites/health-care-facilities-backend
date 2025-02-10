import express from 'express';
import multer from 'multer';
import path from 'path';
import { deleteData, editData, getReport, getReports, saveData, uploadFile } from '../controllers/reportController.js';

const router = express.Router();


// Multer Storage Setup
const upload = multer({ storage: multer.memoryStorage() });

// Routes
router.post('/upload', upload.single('file'), uploadFile);
router.post('/save', saveData);
router.get('/get-reports', getReports);
router.put('/edit', editData);
router.delete('/delete', deleteData);
router.get('/get-report', getReport);

export default router;