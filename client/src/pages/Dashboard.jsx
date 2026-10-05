import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";

export default function Dashboard() {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: analyses = [], isLoading, refetch } = useQuery({
    queryKey: ["analyses", page],
    queryFn: async () => {
      try {
        const res = await api.get("/analysis");
        const raw = res.data?.analyses || res.data?.items || res.data || [];
        return Array.isArray(raw) ? raw : [];
      } catch (err) {
        try {
          const res2 = await api.get("/analysis");
          const raw2 = res2.data?.analyses || res2.data?.items || res2.data || [];
          return Array.isArray(raw2) ? raw2 : [];
        } catch (err2) {
          return [];
        }
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      try {
        await api.delete(`/analysis/`);
      } catch (err) {
        await api.delete(`/analysis/${id}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["analyses"]);
      refetch();
    },
  });

  if (isLoading) return <p className="p-6 text-gray-500">Loading your analyses...</p>;

  return (
    <div className="space-y-4 p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Analyses</h1>
      </div>

      {analyses.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="mb-4 text-gray-600">No analyses found yet.</p>
          <button
            type="button"
            onClick={() => navigate("/analysis/new")}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 shadow font-semibold cursor-pointer"
          >
            Create your first analysis
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {analyses.map((item) => {
            const id = item._id || item.id;
            const jobTitle = item.jobTitle || "Full Stack Developer";
            const matchScore = item.matchScore ?? item.result?.matchScore ?? "N/A";
            const createdAt = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recent";

            return (
              <div key={id} className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <Link to={`/analysis/${id}`} className="flex-1 pr-4 block cursor-pointer">
                  <p className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors">{jobTitle}</p>
                  <p className="text-xs text-gray-500 mt-1">Analyzed on {createdAt}</p>
                </Link>
                <span className="mx-4 font-bold text-indigo-600 text-sm">Match Score: {matchScore}%</span>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this analysis?")) {
                      deleteMutation.mutate(id);
                    }
                  }}
                  disabled={deleteMutation.isPending && deleteMutation.variables === id}
                  className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
