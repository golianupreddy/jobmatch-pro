export default function AnalysisResult({ analysis }) {
  const analysisObj = analysis?.analysis || analysis;
  const resultData = analysisObj?.result || {};
  
  const {
    matchScore = 0,
    matchingKeywords = [],
    missingKeywords = [],
    suggestions = []
  } = resultData;

  const createdAt = analysisObj?.createdAt || analysis?.createdAt;
  const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString() : 'Recent';

  return (
    <div className="space-y-6 rounded-xl bg-white p-6 shadow border border-gray-100">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Analysis Results</h2>
          <p className="text-sm text-gray-500">Analyzed on {formattedDate}</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-extrabold text-indigo-600">{matchScore}%</span>
          <p className="text-xs text-gray-500 font-medium uppercase">Match Score</p>
        </div>
      </div>

      {/* Matching Keywords */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Matching Keywords</h3>
        <div className="flex flex-wrap gap-2">
          {matchingKeywords.length > 0 ? (
            matchingKeywords.map((kw, idx) => (
              <span key={idx} className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 border border-green-200">
                {kw}
              </span>
            ))
          ) : (
            <p className="text-sm text-gray-500">No matching keywords found.</p>
          )}
        </div>
      </div>

      {/* Missing Keywords */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Missing Keywords</h3>
        <div className="flex flex-wrap gap-2">
          {missingKeywords.length > 0 ? (
            missingKeywords.map((kw, idx) => (
              <span key={idx} className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700 border border-red-200">
                {kw}
              </span>
            ))
          ) : (
            <p className="text-sm text-gray-500">None! Great job matching keywords.</p>
          )}
        </div>
      </div>

      {/* Suggestions */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Actionable Suggestions</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
          {suggestions.length > 0 ? (
            suggestions.map((sug, idx) => (
              <li key={idx}>{sug}</li>
            ))
          ) : (
            <li>No suggestions provided.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
