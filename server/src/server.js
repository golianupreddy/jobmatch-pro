import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import analysisRoutes from './routes/analysis.routes.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.options(/.*/, cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/analyses', analysisRoutes); // Added plural support for dashboard

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'JobMatch Pro API' });
});

// MongoDB Connection & Server Start
const PORT = process.env.PORT || 5000;

if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log("MongoDB connected successfully");
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch(err => console.log("MongoDB connection error:", err));
}
