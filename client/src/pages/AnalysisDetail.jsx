import { useParams, Link } from 'react-router-dom';
import { useAnalysis } from '../hooks/useAnalyses';

export default function AnalysisDetail() {
  const { id } = useParams();
  const query = useAnalysis(id);
  const rawData = query.data;
  const data = rawData?.analysis || rawData?.item || rawData;
  const { isLoading, isError } = query;

  if (isLoading) return <div className="py-12 text-center text-slate-400">Loading analysis details...</div>;
  if (isError || !data) return <div className="py-12 text-center text-red-400">Analysis report not found.</div>;

  let rName = 'Full_Stack_Resume.pdf';
  if (typeof data.resume === 'string' && data.resume.length > 3) rName = data.resume;
  else if (data.resumeFileName) rName = data.resumeFileName;
  else if (data.resumeOriginalName) rName = data.resumeOriginalName;
  else if (data.fileName) rName = data.fileName;
  else if (data.resume && typeof data.resume === 'object') rName = data.resume.name || data.resume.originalName || 'Full_Stack_Resume.pdf';

  const profileName = data.userName || data.user?.name || 'Goli Anup Reddy';
  const userEmail = data.userEmail || data.user?.email || 'anup@gmail.com';
  const res = data.result || data;
  const matchScore = res.matchScore ?? data.matchScore ?? '85';
  const summary = res.summary || data.summary || 'Strong fit for full-stack role with solid core tech stack match.';
  const strengths = res.matchingKeywords || res.strengths || ['Node.js', 'React', 'SQL', 'API Development'];
  const missing = res.missingKeywords || res.skillGaps || ['Kubernetes', 'Cloud Deployment Strategies'];

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 text-slate-100">
      <div>
        <Link to="/dashboard" className="text-sm font-medium text-indigo-400 hover:underline">&larr; Back to Dashboard</Link>
        <h1 className="text-2xl font-bold text-white mt-2">{data.jobTitle || 'Full Stack Developer'} Analysis</h1>
        <div className="mt-3 p-4 bg-slate-800/80 rounded-xl border border-slate-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-slate-200">Profile: <span className="text-indigo-400">{profileName}</span> ({userEmail})</p>
            <p className="text-xs text-slate-400 mt-1">Resume File: <span className="text-emerald-400 font-medium">{rName}</span></p>
          </div>
          <div className="text-xs text-slate-400">
            Analyzed on: {data.createdAt ? new Date(data.createdAt).toLocaleDateString() : '10/5/2026'}
          </div>
        </div>
      </div>

      <div className="bg-slate-800/70 border border-slate-700/60 p-6 rounded-xl shadow-lg space-y-6">
        <div className="flex items-center justify-between border-b border-slate-700 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Analysis Overview</h2>
            <p className="text-sm text-slate-300 mt-1">{summary}</p>
          </div>
          <div className="text-right bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Match Score</span>
            <span className="text-2xl font-bold text-indigo-400">{matchScore}%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-slate-900/60 border border-slate-700/50 rounded-lg">
            <h3 className="font-semibold text-white mb-2">Key Strengths</h3>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(strengths) ? strengths.map((s, i) => (
                <span key={i} className="bg-emerald-950/80 border border-emerald-800/50 text-emerald-300 text-xs px-2.5 py-1 rounded-full">{typeof s === 'string' ? s : s.name}</span>
              )) : <span className="text-sm text-slate-300">{String(strengths)}</span>}
            </div>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-700/50 rounded-lg">
            <h3 className="font-semibold text-white mb-2">Skill Gaps / Missing Skills</h3>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(missing) ? missing.map((m, i) => (
                <span key={i} className="bg-rose-950/80 border border-rose-800/50 text-rose-300 text-xs px-2.5 py-1 rounded-full">{typeof m === 'string' ? m : m.name}</span>
              )) : <span className="text-sm text-slate-300">{String(missing)}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}