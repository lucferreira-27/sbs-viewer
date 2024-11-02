// Base URL for the API
export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nodesbs.onrender.com/api/sbs" // Change this to your production API URL when ready
    : "http://localhost:3001/api/sbs";

// Helper function to build API URLs
export function buildApiUrl(path) {
  return `${API_BASE_URL}${path}`;
}
