import { Router } from "express";
import rateLimit from "express-rate-limit";
import { protect } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import {
  analyzeResume,
  getAnalyses,
  getAnalysisById,
  deleteAnalysis,
} from "../controllers/analysis.controller.js";

const router = Router();

router.use(protect);

const analysisLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  keyGenerator: (req) => req.user._id.toString(),
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Analysis limit reached (10 per hour). Please try again later" },
});

router.route("/")
  .get(getAnalyses)
  .post(analysisLimiter, upload.single('resume'), analyzeResume);

router.route("/:id")
  .get(getAnalysisById)
  .delete(deleteAnalysis);

export default router;

