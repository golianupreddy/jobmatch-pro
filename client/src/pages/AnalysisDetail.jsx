import { useParams, Link } from 'react-router-dom';
import { useAnalysis } from '../hooks/useAnalyses';
import ResultCard from '../components/analysis/ResultCard';

export default function AnalysisDetail() {
  const { id } = useParams();
  const { data, isLoading, isError } = useAnalysis(id);

  if (isLoading) return <div className="py-12 text-center text-gray-500" aria-live="polite">Loading analysis details...</div>;
  if (isError || !data) return <div className="py-12 text-center text-red-600">Analysis report not found.</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/dashboard" className="text-sm font-medium text-indigo-600 hover:underline">&larr; Back to Dashboard</Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">{data.jobTitle}</h1>
          <p className="text-xs text-gray-500">Resume: {data.resumeFileName} &bull; Analyzed on {new Date(data.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <ResultCard result={data.result} />
    </div>
  );
}
