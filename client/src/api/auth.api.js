import api from "./axios";

export const loginRequest = (payload) => api.post("/auth/login", payload).then((r) => r.data);
export const signupRequest = (payload) => api.post("/auth/signup", payload).then((r) => r.data);
export const getMeRequest = () => api.get("/auth/me").then((r) => r.data);
