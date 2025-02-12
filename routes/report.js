import express from 'express';
import multer from 'multer';
import { deleteData, editData, getReport, getReports, saveData, savefileData, uploadFile } from '../controllers/reportController.js';

const router = express.Router();


// Multer Storage Setup
const upload = multer({ storage: multer.memoryStorage() });

// Routes
router.post('/upload', upload.single('file'), uploadFile);
router.post('/save', saveData);
router.post('/save-file', savefileData);
router.get('/get-reports', getReports);
router.put('/edit', editData);
router.delete('/delete', deleteData);
router.get('/get-report', getReport);

export default router;