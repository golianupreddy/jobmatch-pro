import express from 'express';
import { analyzeResume, getAnalyses, getAnalysisById, deleteAnalysis } from '../controllers/analysis.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAnalyses)
  .post(upload.single('resume'), analyzeResume);

router.route('/:id')
  .get(getAnalysisById)
  .delete(deleteAnalysis);

export default router;
