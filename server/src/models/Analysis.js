import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobTitle: { type: String, required: true, trim: true },
    jobDescription: { type: String, required: true },
    resumeText: { type: String, required: true },
    result: {
      matchScore: { type: Number, required: true },
      matchingKeywords: [{ type: String }],
      missingKeywords: [{ type: String }],
      suggestions: [{ type: String }],
      summary: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Analysis', analysisSchema);
