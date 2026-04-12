import BASE_URL from "./config.js";

export const API_BASE = BASE_URL;

const customFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // Important for sessions
  });

  if (!response.ok) {
    if (response.status === 401) {
      window.dispatchEvent(new Event("unauthorized"));
    }
    let errorMsg = "API Error";
    try {
      const data = await response.json();
      errorMsg = data.message || data.error || errorMsg;
    } catch (e) {
      // Not JSON
    }
    throw new Error(errorMsg);
  }

  // Not all responses will have JSON (e.g., some simple res.send)
  try {
    return await response.json();
  } catch {
    return true; // Simple success
  }
};

export default customFetch;