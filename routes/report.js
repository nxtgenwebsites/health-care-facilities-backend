import express from 'express';
import multer from 'multer';
import { deleteData, editData, getReport, getReports, saveData, savefileData, uploadFile , getReportByEmail, filterDate, countryDateFillter, userDateFillter} from '../controllers/reportController.js';

const router = express.Router();


// Multer Storage Setup
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 4 * 1024 * 1024 }});

// Routes
router.post('/upload', upload.single('file'), uploadFile);
router.post('/save', saveData);
router.post('/save-file', savefileData);
router.get('/get-reports', getReports);
router.get('/filter-data', filterDate);
router.post('/filter-by-country', countryDateFillter);
router.post('/filter-by-user', userDateFillter);
router.post('/get-user-report', getReportByEmail);
router.put('/edit', editData);
router.delete('/delete', deleteData);
router.get('/get-report', getReport);

export default router;