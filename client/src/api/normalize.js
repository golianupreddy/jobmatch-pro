export const normalizeAnalysis = (a) => ({
  id: a?._id ?? a?.id,
  jobTitle: a?.jobTitle || "Untitled role",
  resumeFileName: a?.resumeFileName || "",
  createdAt: a?.createdAt,
  matchScore: Number.isFinite(a?.result?.matchScore)
    ? a.result.matchScore
    : Number.isFinite(a?.matchScore)
      ? a.matchScore
      : null,
  result: a?.result ?? null,
});

export const normalizeList = (data) => {
  const raw = Array.isArray(data) ? data : data?.items ?? data?.analyses ?? data?.data ?? [];
  return {
    items: raw.map(normalizeAnalysis),
    page: data?.page ?? 1,
    totalPages: data?.totalPages ?? 1,
    total: data?.total ?? raw.length,
  };
};
