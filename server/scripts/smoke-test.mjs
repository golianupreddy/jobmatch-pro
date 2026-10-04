import { readFileSync } from "node:fs";
import path from "node:path";

const BASE = process.env.API_URL || "http://localhost:5000/api";
const resumePath = process.argv[2];

if (!resumePath) {
  console.error("Usage: node scripts/smoke-test.mjs <resume.pdf|resume.txt>");
  process.exit(1);
}

const JD = "We are hiring a Full Stack Developer with strong React, Node.js, Express and MongoDB experience. You will build REST APIs, integrate third-party services, write clean tested code and collaborate with designers in an agile team.";

let failed = false;
const check = (name, ok, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok ? "" : `  (${detail})`}`);
  if (!ok) failed = true;
};

const request = async (route, { token, json, form, method } = {}) => {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (json) headers["Content-Type"] = "application/json";
  const res = await fetch(`${BASE}${route}`, {
    method: method || (json || form ? "POST" : "GET"),
    headers,
    body: json ? JSON.stringify(json) : form,
  });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
};

const resumeForm = (buffer, filename, type) => {
  const form = new FormData();
  form.append("resume", new Blob([buffer], { type }), filename);
  form.append("jobTitle", "Smoke Test Role");
  form.append("jobDescription", JD);
  return form;
};

const signup = (email) =>
  request("/auth/signup", { json: { name: "Smoke", email, password: "secret123" } });

const run = async () => {
  const stamp = Date.now();
  const emailA = `smoke_a_${stamp}@test.com`;
  const emailB = `smoke_b_${stamp}@test.com`;

  let r = await request("/health");
  check("health", r.status === 200, r.status);

  r = await signup(emailA);
  check("signup", r.status === 201 && !!r.body.token, r.status);
  const tokenA = r.body.token;

  r = await signup(emailA);
  check("duplicate signup rejected", r.status === 409, r.status);

  r = await request("/auth/login", { json: { email: emailA, password: "wrong-password" } });
  check("wrong password -> 401", r.status === 401, r.status);

  r = await request("/auth/me");
  check("/me without token -> 401", r.status === 401, r.status);

  r = await request("/auth/me", { token: tokenA });
  check("/me with token", r.status === 200, r.status);

  r = await request("/analysis", { form: new FormData(), token: tokenA });
  check("analysis without file -> 400", r.status === 400, r.status);

  const type = path.extname(resumePath).toLowerCase() === ".pdf" ? "application/pdf" : "text/plain";
  r = await request("/analysis", {
    form: resumeForm(readFileSync(resumePath), path.basename(resumePath), type),
    token: tokenA,
  });
  check("analysis created", r.status === 201, `${r.status} ${r.body.message ?? ""}`);

  const result = r.body.result ?? {};
  const id = r.body.id;
  check(
    "score is integer 0-100",
    Number.isInteger(result.matchScore) && result.matchScore >= 0 && result.matchScore <= 100,
    result.matchScore
  );
  check(
    "keywords and suggestions are arrays",
    [result.matchingKeywords, result.missingKeywords, result.suggestions].every(Array.isArray)
  );
  console.log(
    `      score: ${result.matchScore} | matching: ${result.matchingKeywords?.length} | missing: ${result.missingKeywords?.length}`
  );

  if (!id) {
    console.log("No analysis id, skipping history and IDOR checks");
    return;
  }

  r = await request("/analysis", { token: tokenA });
  check("history list", r.status === 200, r.status);

  r = await request(`/analysis/${id}`, { token: tokenA });
  check("owner can read analysis", r.status === 200, r.status);

  r = await signup(emailB);
  const tokenB = r.body.token;

  r = await request(`/analysis/${id}`, { token: tokenB });
  check("other user cannot read (IDOR)", [403, 404].includes(r.status), r.status);

  r = await request(`/analysis/${id}`, { token: tokenB, method: "DELETE" });
  check("other user cannot delete (IDOR)", [403, 404].includes(r.status), r.status);

  r = await request(`/analysis/${id}`, { token: tokenA, method: "DELETE" });
  check("owner can delete", [200, 204].includes(r.status), r.status);

  r = await request(`/analysis/${id}`, { token: tokenA });
  check("deleted analysis -> 404", r.status === 404, r.status);
};

run()
  .then(() => {
    console.log(failed ? "\nSome checks FAILED" : "\nAll checks passed");
    process.exit(failed ? 1 : 0);
  })
  .catch((e) => {
    console.error("Smoke test crashed:", e.message);
    process.exit(1);
  });
