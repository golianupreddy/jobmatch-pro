import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAnalysis } from '../../api/analysis.api';
import { getErrorMessage } from '../../api/axios';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const JD_MIN = 50;
const JD_MAX = 8000;

function validate({ resume, jobDescription }) {
  const errors = {};
  if (!resume) {
    errors.resume = 'Please choose a resume file';
  } else {
    const ext = resume.name.toLowerCase().match(/\.[a-z0-9]+$/)?.[0];
    if (ext !== '.pdf' && ext !== '.txt') {
      errors.resume = 'Only PDF or TXT files are allowed';
    } else if (resume.size > MAX_FILE_SIZE) {
      errors.resume = 'File must be 5 MB or smaller';
    }
  }
  const length = jobDescription.trim().length;
  if (length < JD_MIN) {
    errors.jobDescription = 'Job description must be at least 50 characters';
  } else if (length > JD_MAX) {
    errors.jobDescription = 'Job description must be at most 8000 characters';
  }
  return errors;
}

export default function AnalysisForm({ onResult }) {
  const queryClient = useQueryClient();
  const [resume, setResume] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [errors, setErrors] = useState({});

  const mutation = useMutation({
    mutationFn: createAnalysis,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['analyses'] });
      onResult?.(data);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate({ resume, jobDescription });
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    mutation.mutate({
      resume,
      jobTitle: jobTitle.trim(),
      jobDescription: jobDescription.trim(),
    });
  };

  const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500';

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-xl bg-white p-6 shadow border border-gray-100">
      <div>
        <label htmlFor="jobTitle" className="mb-1 block text-sm font-medium text-gray-700">Job title (optional)</label>
        <input id="jobTitle" type="text" maxLength={100} value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Full Stack Developer" className={inputClass} />
      </div>
      <div>
        <label htmlFor="resume" className="mb-1 block text-sm font-medium text-gray-700">Resume (PDF or TXT, max 5 MB)</label>
        <input id="resume" type="file" accept=".pdf,.txt" onChange={(e) => setResume(e.target.files?.[0] ?? null)} className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:font-medium file:text-indigo-700 hover:file:bg-indigo-100" />
        {resume && <p className="mt-1 text-xs text-gray-500">{resume.name} ({(resume.size / 1024).toFixed(0)} KB)</p>}
        {errors.resume && <p role="alert" className="mt-1 text-sm text-red-600">{errors.resume}</p>}
      </div>
      <div>
        <label htmlFor="jobDescription" className="mb-1 block text-sm font-medium text-gray-700">Job description</label>
        <textarea id="jobDescription" rows={10} value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste the full job description here..." className={inputClass} />
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>{errors.jobDescription && <span role="alert" className="text-sm text-red-600">{errors.jobDescription}</span>}</span>
          <span>{jobDescription.length} / {JD_MAX}</span>
        </div>
      </div>
      {mutation.isError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{getErrorMessage(mutation.error)}</p>}
      <button type="submit" disabled={mutation.isPending} className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
        {mutation.isPending ? 'Analyzing... this can take up to 30 seconds' : 'Analyze match'}
      </button>
    </form>
  );
}
