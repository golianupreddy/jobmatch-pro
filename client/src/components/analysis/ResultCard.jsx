export default function ResultCard({ result }) {
  const score = result?.matchScore ?? 0;
  const scoreColor = score >= 75 ? 'text-green-600 bg-green-50 border-green-200' : score >= 50 ? 'text-yellow-600 bg-yellow-50 border-yellow-200' : 'text-red-600 bg-red-50 border-red-200';

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow border border-gray-100">
      {/* Score Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Analysis Results</h3>
          <p className="text-sm text-gray-500">Detailed breakdown of resume against job description</p>
        </div>
        <div className={`flex flex-col items-center justify-center rounded-2xl border px-6 py-4 ${scoreColor}`}>
          <span className="text-3xl font-bold">{score}%</span>
          <span className="text-xs font-medium uppercase tracking-wider">Match Score</span>
        </div>
      </div>

      {/* Keywords Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Matching Keywords</h4>
          <div className="flex flex-wrap gap-2">
            {result?.matchingKeywords?.length > 0 ? (
              result.matchingKeywords.map((kw, i) => (
                <span key={i} className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">{kw}</span>
              ))
            ) : (
              <p className="text-xs text-gray-500">No matching keywords found.</p>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Missing Keywords</h4>
          <div className="flex flex-wrap gap-2">
            {result?.missingKeywords?.length > 0 ? (
              result.missingKeywords.map((kw, i) => (
                <span key={i} className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">{kw}</span>
              ))
            ) : (
              <p className="text-xs text-gray-500">None! Great job matching keywords.</p>
            )}
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="border-t border-gray-100 pt-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Actionable Suggestions</h4>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
          {result?.suggestions?.length > 0 ? (
            result.suggestions.map((sug, i) => <li key={i}>{sug}</li>)
          ) : (
            <li>No suggestions provided.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
