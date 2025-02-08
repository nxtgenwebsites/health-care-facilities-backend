import express from 'express';
import multer from 'multer';
import path from 'path';
import { getReports, processFile, saveData } from '../controllers/reportController.js';

const router = express.Router();

// Multer Storage Setup
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Routes
router.post('/upload', upload.single('file'), processFile);
router.post('/save', saveData);
router.get('/get-reports', getReports)

export default router;
