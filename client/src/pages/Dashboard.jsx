import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAnalyses, useDeleteAnalysis } from '../hooks/useAnalyses';

export default function Dashboard() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useAnalyses(page);
  const deleteMutation = useDeleteAnalysis();

  if (isLoading) return <div className="py-12 text-center text-gray-500" aria-live="polite">Loading your analyses...</div>;
  if (isError) return <div className="py-12 text-center text-red-600">Failed to load analyses. Please try again.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">View your past resume analyses and match scores</p>
        </div>
        <Link to="/analyze" className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">
          New Analysis
        </Link>
      </div>

      {data?.items?.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow border border-gray-100">
          <p className="text-gray-500 mb-4">No resume analyses found yet.</p>
          <Link to="/analyze" className="text-indigo-600 font-medium hover:underline">Run your first analysis</Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {data.items.map((item) => (
            <div key={item._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl bg-white p-5 shadow-sm border border-gray-100">
              <div>
                <Link to={`/analysis/${item._id}`} className="text-lg font-semibold text-indigo-600 hover:underline">
                  {item.jobTitle}
                </Link>
                <p className="text-xs text-gray-500 mt-1">
                  File: {item.resumeFileName} &bull; {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="rounded-full bg-indigo-50 px-3.5 py-1 text-sm font-bold text-indigo-700">
                  {item.result?.matchScore}% Match
                </span>
                <button onClick={() => deleteMutation.mutate(item._id)} className="text-sm font-medium text-red-600 hover:text-red-800">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {data?.pages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50">
            Previous
          </button>
          <span className="px-3 py-1.5 text-sm text-gray-700">Page {page} of {data.pages}</span>
          <button onClick={() => setPage((p) => Math.min(data.pages, p + 1))} disabled={page === data.pages} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50">
            Next
          </button>
        </div>
      )}
    </div>
  );
}
