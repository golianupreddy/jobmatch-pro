import Analysis from '../models/Analysis.js';
import { analyzeResumeWithAI } from '../services/ai.service.js';

export const analyzeResume = async (req, res, next) => {
  try {
    const { jobTitle, jobDescription } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'Please upload a resume file (.pdf or .txt)' });
    }
    if (!jobTitle || !jobDescription) {
      return res.status(400).json({ message: 'Please provide job title and job description' });
    }

    const resumeText = file.buffer.toString('utf8');

    // Call Gemini AI service
    const aiResult = await analyzeResumeWithAI({ resumeText, jobTitle, jobDescription });

    const analysis = await Analysis.create({
      user: req.user._id,
      jobTitle,
      jobDescription,
      resumeText,
      result: aiResult,
    });

    return res.status(201).json({
      id: analysis._id,
      message: 'Resume analyzed successfully',
      result: analysis.result,
    });
  } catch (error) {
    console.error('Analysis Error:', error);
    return res.status(500).json({ message: error.message });
  }
};

export const getAnalyses = async (req, res, next) => {
  try {
    const analyses = await Analysis.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json({ analyses });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAnalysisById = async (req, res, next) => {
  try {
    const analysis = await Analysis.findOne({ _id: req.params.id, user: req.user._id });
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }
    return res.json({ analysis });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAnalysis = async (req, res, next) => {
  try {
    const analysis = await Analysis.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }
    return res.json({ message: 'Analysis deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
