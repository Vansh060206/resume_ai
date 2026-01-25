import axios from 'axios';

// API Base URLs
const NEXTJS_API_URL = '/api'; // Next.js API routes

// Create axios instance for Next.js API
const api = axios.create({
  baseURL: NEXTJS_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      typeof window !== 'undefined' && localStorage.removeItem('token');
      typeof window !== 'undefined' && localStorage.removeItem('refreshToken');
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH APIs ====================
export const authAPI = {
  // Register new user
  register: (data) => api.post('/auth/register', data),

  // Login user
  login: (data) => api.post('/auth/login', data),

  // Logout user
  logout: () => {
    typeof window !== 'undefined' && localStorage.removeItem('token');
    typeof window !== 'undefined' && localStorage.removeItem('refreshToken');
    return Promise.resolve({ success: true });
  },

  // Refresh token
  refreshToken: (refreshToken) => api.post('/auth/refresh-token', { refreshToken }),

  // Check if user is authenticated
  isAuthenticated: () => {
    return typeof window !== 'undefined' && !!localStorage.getItem('token');
  },
};

// ==================== ANALYSIS APIs ====================
export const analysisAPI = {
  // Analyze resume file
  analyze: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/analysis', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Get analysis history
  getHistory: (userId, page = 1, limit = 10) =>
    api.get(`/analysis/history?userId=${userId}&page=${page}&limit=${limit}`),
};

// ==================== USER APIs ====================
export const userAPI = {
  // Get user profile (token-based)
  getProfile: () => api.get('/profile'),

  // Update user profile (token-based)
  updateProfile: (data) => api.put('/profile', data),

  // Other APIs unchanged
  getStats: (userId) => api.get(`/stats?userId=${userId}`),
  getPreferences: (userId) => api.get(`/preferences?userId=${userId}`),
  updatePreferences: (data) => api.post('/preferences', data),
};

// ==================== RESUME APIs ====================
export const resumeAPI = {
  // List all resumes (token-based auth)
  list: (page = 1, limit = 10) =>
    api.get(`/resumes?page=${page}&limit=${limit}`),

  // Get specific resume (token-based auth)
  getDetail: (resumeId) =>
    api.get(`/resumes/${resumeId}`),

  // Save analysis result
  saveAnalysis: (data) => api.post('/resumes', data),

  // Delete resume
  delete: (resumeId) => api.delete(`/resumes/${resumeId}`),

  // Compare two resumes
  compare: (resumeId1, resumeId2) =>
    api.post('/stats/compare', { resumeId1, resumeId2 }),
};

// ==================== JOB APIs ====================
export const jobAPI = {
  // Match resume with job description
  match: (data) => api.post('/jobs/match', data),

  // Get job suggestions
  getSuggestions: (skills, role = 'Software Engineer') =>
    api.get(`/jobs/suggestions?skills=${skills.join(',')}&role=${role}`),

  // Extract keywords from job description
  extractKeywords: (jobDescription) =>
    api.post('/jobs/keywords', { jobDescription }),
};

// ==================== EXPORT APIs ====================
export const exportAPI = {
  // Export as JSON
  exportJSON: (data) => api.post('/export?format=json', data),

  // Export as Markdown
  exportMarkdown: (data) => api.post('/export?format=markdown', data),

  // Download JSON file
  downloadJSON: async (data) => {
    const response = await fetch('/api/export?format=json&download=true', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume_analysis_${Date.now()}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  },

  // Download Markdown file
  downloadMarkdown: async (data) => {
    const response = await fetch('/api/export?format=markdown&download=true', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume_analysis_${Date.now()}.md`;
    a.click();
    window.URL.revokeObjectURL(url);
  },

  // Get summary statistics
  getSummary: (data) => api.post('/export/summary', data),
};

// Export default api instance
export default api;
