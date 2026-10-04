import { useNavigate } from 'react-router-dom';
import AnalysisForm from '../components/analysis/AnalysisForm';

export default function NewAnalysis() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">New Resume Analysis</h1>
        <p className="text-sm text-gray-500">Upload your resume and paste a job description to get instant AI feedback</p>
      </div>
      <AnalysisForm onResult={(data) => navigate(`/analysis/${data.id}`)} />
    </div>
  );
}
