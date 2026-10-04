import dotenv from 'dotenv';
dotenv.config();

const { default: connectDB } = await import('./config/db.js');
const { default: app } = await import('./app.js');

const PORT = process.env.PORT || 5000;

await connectDB();

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});