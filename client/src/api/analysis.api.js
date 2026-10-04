import api from "./axios";

export const createAnalysis = ({ resume, jobTitle, jobDescription }) => {
  const form = new FormData();
  form.append("resume", resume);
  form.append("jobTitle", jobTitle);
  form.append("jobDescription", jobDescription);
  return api.post("/analysis", form, { timeout: 90000 }).then((r) => r.data);
};
