import { Link } from 'react-router-dom';

export default function ResultCard({ analysis, onDelete }) {
  if (!analysis) return null;

  // Extracting data safely whether nested inside 'analysis' or flat
  const analysisObj = analysis?.analysis || analysis;
  const resultData = analysisObj?.result || analysisObj?.analysisResult || {};

  const matchScore =
    resultData.matchScore ??
    analysisObj.matchScore ??
    analysis?.matchScore ??
    'N/A';

  const jobTitle = analysis?.jobTitle || analysisObj?.jobTitle || 'Full Stack Developer';
  const createdAt = analysis?.createdAt || analysisObj?.createdAt;
  const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString() : 'Recent';
  const id = analysis?._id || analysis?.id;

  return (
    <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <Link to={`/analyses/${id}`} className="flex-1 pr-4">
        <h3 className="font-semibold text-gray-900">{jobTitle}</h3>
        <p className="text-xs text-gray-500 mt-1">Analyzed on {formattedDate}</p>
      </Link>
      <div className="flex items-center space-x-4">
        <span className="text-sm font-bold text-indigo-600">Match Score: {matchScore}%</span>
        {onDelete && (
          <button
            onClick={() => onDelete(id)}
            className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
